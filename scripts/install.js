const fs = require('fs');
const https = require('https');
const path = require('path');
const os = require('os');
const { execSync } = require('child_process');

const packageJson = require('../package.json');
const version = packageJson.version;
// Change this to your actual repo structure user/repo
const REPO_URL = 'github.com/unickhow/cz';

function getPlatform() {
  const platform = os.platform();
  const arch = os.arch();

  if (platform === 'win32' && arch === 'x64') return 'win32-x64.exe';
  if (platform === 'darwin') return arch === 'arm64' ? 'darwin-arm64' : 'darwin-x64';
  if (platform === 'linux' && arch === 'x64') return 'linux-x64';

  console.error(`Unsupported platform: ${platform} ${arch}`);
  process.exit(1);
}

const platform = getPlatform();
const binaryName = `cz-${platform}`;
const url = `https://${REPO_URL}/releases/download/v${version}/${binaryName}`;

const destDir = path.join(__dirname, '../vendor');
if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

const destPath = path.join(destDir, platform === 'win32-x64.exe' ? 'cz.exe' : 'cz');

console.log(`Downloading ${binaryName} from ${url}...`);

const file = fs.createWriteStream(destPath);

https.get(url, (response) => {
  if (response.statusCode === 302 || response.statusCode === 301) {
    // Handle redirect
    https.get(response.headers.location, (response) => {
      pipeToFile(response);
    });
  } else if (response.statusCode === 200) {
    pipeToFile(response);
  } else {
    console.error(`Failed to download binary: HTTP ${response.statusCode}`);
    console.error(url);
    fs.unlink(destPath, () => process.exit(1));
  }
}).on('error', (err) => {
  console.error('Error downloading binary:', err.message);
  fs.unlink(destPath, () => process.exit(1));
});

function pipeToFile(response) {
  response.pipe(file);
  file.on('finish', () => {
    file.close(() => {
      console.log('Download completed.');
      if (os.platform() !== 'win32') {
        try {
          execSync(`chmod +x ${destPath}`);
        } catch (e) {
          console.error('Failed to make binary executable');
        }
      }
      process.exit(0);
    });
  });
}
