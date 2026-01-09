#!/usr/bin/env node

const fs = require('fs');
const { spawn } = require('child_process');
const path = require('path');
const os = require('os');

// The install script puts the binary in ../vendor/cz (or cz.exe)
const binaryName = os.platform() === 'win32' ? 'cz.exe' : 'cz';

// Resolve the real path of this script to handle symlinks (e.g. pnpm)
const realScriptPath = fs.realpathSync(__filename);
const packageRoot = path.join(path.dirname(realScriptPath), '..');
const binaryPath = path.join(packageRoot, 'vendor', binaryName);

const child = spawn(binaryPath, process.argv.slice(2), { stdio: 'inherit' });

child.on('error', (err) => {
  if (err.code === 'ENOENT') {
    console.error(`Error: Could not find the binary at ${binaryPath}.`);
    console.error('Please try reinstalling the package: npm install -g @unickhow/cz');
  } else {
    console.error('Error executing binary:', err);
  }
  process.exit(1);
});

child.on('close', (code) => {
  process.exit(code);
});
