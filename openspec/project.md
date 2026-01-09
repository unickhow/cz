# Project Context

## Purpose
`cz` is a lightweight CLI tool ("rough commitizen") designed to enforce and facilitate conventional commit messages. It provides an interactive prompt to help users format their commits according to standard conventions.

## Tech Stack
- **Language**: Rust (2021 edition)
- **Build Tool**: Cargo
- **CLI Framework**: Clap (Command Line Argument Parser)
- **Interactive Prompts**: Inquire (or Dialoguer)
- **Process Execution**: std::process::Command

## Project Conventions

### Code Style
- **Formatting**: `rustfmt` (standard settings).
- **Linting**: `clippy` (warn on common mistakes).
- **Naming**: snake_case for functions/vars, PascalCase for structs/enums.
- **File Structure**:
  - `src/main.rs`: Entry point.
  - `src/commands.rs`: Command logic (if multiple commands exist).
  - `src/types.rs`: Commit types and data structures.

### Architecture Patterns
- **Safety**: Use `Result` for all fallible operations.
- **Modularity**: Separate UI logic (prompts) from Business logic (git execution).

### Testing Strategy
- **Unit Tests**: `#[test]` modules within source files for logic.
- **Integration Tests**: `tests/` directory using `assert_cmd` to test CLI invocation and git side effects.

### Git Workflow
- **Commits**: Strictly follows Conventional Commits.
- **Branching**: Feature branching.

## Domain Context
- **Conventional Commits**: Understanding of the specification (types: feat, fix, etc.) is crucial.
- **Git Hooks**: The tool is often used in git hooks.

## Important Constraints
- **Performance**: Must be instant. Rust is chosen for this reason.
- **Binary Size**: Release builds should be optimized (`--release`).

## External Dependencies
- **Git**: Requires git to be installed and accessible.
