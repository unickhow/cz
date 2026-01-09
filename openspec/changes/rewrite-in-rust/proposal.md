# Change: Rewrite in Rust

## Why
- **Performance**: Rust provides faster startup times and execution, critical for a tool used in git hooks.
- **Robustness**: Static typing and result handling reduce runtime errors.
- **Single Binary**: Easier distribution compared to Node.js scripts.
- **Constraint**: User explicitly requested a rewrite in Rust.

## What Changes
- **Tech Stack**: Migration from TypeScript/Node.js to Rust.
- **Codebase**:
    - Remove `src/*.ts`, `bin/*.mjs`, `package.json` (except as needed for legacy/scripts), `tsconfig.json`.
    - Initialize new Cargo project structure.
- **Behavior**: Functionality remains exactly the same as the current TS version.

## Impact
- **Affected Specs**: `cz` capability (new spec proposed).
- **Breaking Changes**:
    - Requires Rust toolchain to build from source.
    - Installation method changes (from `npm install` to `cargo install` or binary download).
