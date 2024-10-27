# CZ
simple commit tool for instantly use, choose a type and get to the point.

## Installation
```bash
npm install -g unickhow/cz
# or
yarn add -g unickhow/cz
# or
pnpm install -g unickhow/cz
# or
bun add -g unickhow/cz
```

## Uninstall
```bash
npm uninstall -g cz
# or
yarn remove -g cz
# or
pnpm uninstall -g cz
# or
bun remove -g cz
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
    "emoji": "🧹",
    "description": "Build process or auxiliary tool changes",
    "value": "chore"
  },
  {
    "name": "ci",
    "emoji": "👷",
    "description": "CI related changes",
    "value": "ci"
  },
  {
    "name": "docs",
    "emoji": "📝",
    "description": "Documentation only changes",
    "value": "docs"
  },
  {
    "name": "feat",
    "emoji": "💡",
    "description": "A new feature",
    "value": "feat"
  },
  {
    "name": "fix",
    "emoji": "🪲",
    "description": "A bug fix",
    "value": "fix"
  },
  {
    "name": "hotfix",
    "emoji": "🚨",
    "description": "Emergency fix",
    "value": "hotfix"
  },
  {
    "name": "perf",
    "emoji": "⚡",
    "description": "A code change that improves performance",
    "value": "perf"
  },
  {
    "name": "refactor",
    "emoji": "🧬",
    "description": "A code change that neither fixes a bug or adds a feature",
    "value": "refactor"
  },
  {
    "name": "release",
    "emoji": "🎉",
    "description": "Create a release commit",
    "value": "release"
  },
  {
    "name": "style",
    "emoji": "🚧",
    "description": "Markup, white-space, formatting, missing semi-colons...",
    "value": "style"
  },
  {
    "name": "test",
    "emoji": "🧪",
    "description": "Adding missing tests",
    "value": "test"
  }
]
```

## Todo
- [x] bundler
- [ ] test
