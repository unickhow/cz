# CZ
simple commit tool for instantly use, choose a type and get to the point.

## Installation
```bash
npm install -g unickhow/cz
# or
yarn add -g unickhow/cz
# or
pnpm install -g unickhow/cz
```

## Uninstall
```bash
npm uninstall -g cz
# or
yarn remove -g cz
# or
pnpm uninstall -g cz
```

## Usage

```bash
cz
```

## Types

```json
[
  {
    "name": "chore",
    "emoji": "๐งน",
    "description": "Build process or auxiliary tool changes",
    "value": "chore"
  },
  {
    "name": "ci",
    "emoji": "๐ท",
    "description": "CI related changes",
    "value": "ci"
  },
  {
    "name": "docs",
    "emoji": "๐",
    "description": "Documentation only changes",
    "value": "docs"
  },
  {
    "name": "feat",
    "emoji": "๐ก",
    "description": "A new feature",
    "value": "feat"
  },
  {
    "name": "fix",
    "emoji": "๐ชฒ",
    "description": "A bug fix",
    "value": "fix"
  },
  {
    "name": "hotfix",
    "emoji": "๐จ",
    "description": "Emergency fix",
    "value": "hotfix"
  },
  {
    "name": "perf",
    "emoji": "โก",
    "description": "A code change that improves performance",
    "value": "perf"
  },
  {
    "name": "refactor",
    "emoji": "๐งฌ",
    "description": "A code change that neither fixes a bug or adds a feature",
    "value": "refactor"
  },
  {
    "name": "release",
    "emoji": "๐",
    "description": "Create a release commit",
    "value": "release"
  },
  {
    "name": "style",
    "emoji": "๐ง",
    "description": "Markup, white-space, formatting, missing semi-colons...",
    "value": "style"
  },
  {
    "name": "test",
    "emoji": "๐งช",
    "description": "Adding missing tests",
    "value": "test"
  }
]
```

## Todo
- [ ] bundler
- [ ] test