import prompts from 'prompts';
import execa from 'execa';
import picocolors from 'picocolors';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import yargs from 'yargs';

const commitTypes = [
  {
    "name": "chore",
    "emoji": "\u{1F9F9}",
    "description": "Build process or auxiliary tool changes",
    "value": "chore"
  },
  {
    "name": "ci",
    "emoji": "\u{1F477}",
    "description": "CI related changes",
    "value": "ci"
  },
  {
    "name": "docs",
    "emoji": "\u{1F4DD}",
    "description": "Documentation only changes",
    "value": "docs"
  },
  {
    "name": "feat",
    "emoji": "\u{1F4A1}",
    "description": "A new feature",
    "value": "feat"
  },
  {
    "name": "fix",
    "emoji": "\u{1FAB2}",
    "description": "A bug fix",
    "value": "fix"
  },
  {
    "name": "hotfix",
    "emoji": "\u{1F6A8}",
    "description": "Emergency fix",
    "value": "hotfix"
  },
  {
    "name": "perf",
    "emoji": "\u26A1",
    "description": "A code change that improves performance",
    "value": "perf"
  },
  {
    "name": "refactor",
    "emoji": "\u{1F9EC}",
    "description": "A code change that neither fixes a bug or adds a feature",
    "value": "refactor"
  },
  {
    "name": "release",
    "emoji": "\u{1F389}",
    "description": "Create a release commit",
    "value": "release"
  },
  {
    "name": "style",
    "emoji": "\u{1F6A7}",
    "description": "Markup, white-space, formatting, missing semi-colons...",
    "value": "style"
  },
  {
    "name": "test",
    "emoji": "\u{1F9EA}",
    "description": "Adding missing tests",
    "value": "test"
  }
];

const typesList = commitTypes.map((type) => ({
  title: type.name,
  description: `${type.emoji} ${type.description}`,
  value: type.value,
  emoji: type.emoji
}));
const step_type = {
  type: "autocomplete",
  name: "commit_type",
  message: "Pick a commit type.",
  choices: typesList,
  fallback: "No matched type."
};
const step_message = {
  type: "text",
  name: "commit_message",
  message: (prev) => {
    const target = typesList.find((type) => type.value === prev);
    return `${target.emoji} ${target.title}`;
  },
  validate: (value) => {
    if (!value) {
      return "Commit message is required.";
    }
    return true;
  }
};
const step_description = {
  type: "text",
  name: "commit_description",
  message: "Commit description (optional)",
  initial: "",
  validate: (value) => {
    if (value.length > 100) {
      return "Description is too long.";
    }
    return true;
  }
};
const cli = async () => {
  let isCanceled = false;
  const order = [
    step_type,
    step_message,
    step_description
  ].filter(Boolean);
  const response = await prompts(order, {
    onSubmit: (prompt, answers) => {
      if (answers === void 0) {
        isCanceled = true;
        return true;
      }
    },
    onCancel: (prompt) => {
      isCanceled = true;
      return false;
    }
  });
  if (isCanceled) {
    console.log(picocolors.magenta(" commit abort. "));
    return false;
  }
  const { commit_type, commit_message, commit_description } = response;
  const type = typesList.find((type2) => type2.value === commit_type);
  const commitTitle = `${type.emoji} ${commit_type}: ${commit_message}`;
  try {
    const commands = commit_description ? ["commit", "-m", commitTitle, "-m", commit_description] : ["commit", "-m", commitTitle];
    const commitResult = await execa("git", commands);
    const branchHashName = commitResult.stdout.match(/\[(.*?)\]/).pop();
    const [branchName, branchHash] = branchHashName.split(" ");
    console.log("-----------------------------------------------------------");
    console.log(picocolors.dim(commitResult.stdout));
    if (commitResult.stderr !== "") {
      console.log("-----------------------------------------------------------");
      console.log(picocolors.dim(commitResult.stderr));
    }
    console.log("-----------------------------------------------------------");
    console.log(`${picocolors.bgGreen(picocolors.bold(" Title       "))} ${picocolors.green(commitTitle)}`);
    if (commit_description) {
      console.log(`${picocolors.bgGreen(picocolors.bold(" Description "))} ${picocolors.green(commit_description)}`);
    }
    console.log(`${picocolors.bgGreen(picocolors.bold(" Commit hash "))} ${picocolors.bold(picocolors.cyan(` ${branchHash} `))} (${picocolors.italic(picocolors.green(branchName))})`);
  } catch (error) {
    console.log(picocolors.red(error.stderr));
    if (error.exitCode === 1)
      console.log(picocolors.bgRed(" No changes added to commit. "));
    else
      console.error(error);
  }
};

const __dirname = dirname(fileURLToPath(import.meta.url));
const where = () => {
  console.log(`Your config will be saved in ${__dirname}.`);
};

async function run(args) {
  const argv = yargs(args).options({
    "where": {
      alias: "w",
      describe: "Show config file path."
    }
  }).help().argv;
  if (argv.where) {
    where();
  } else {
    cli();
  }
}

export { run };