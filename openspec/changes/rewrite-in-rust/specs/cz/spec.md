## ADDED Requirements

### Requirement: Interactive Commit Flow
The CLI SHALL guide the user through creating a conventional commit message via interactive prompts.

#### Scenario: Successful Commit
- **WHEN** the user runs `cz`
- **AND** selects a commit type (e.g., `feat`)
- **AND** enters a commit message (e.g., `add rust support`)
- **AND** optionally enters a description (e.g., `rewrite in rust`)
- **THEN** it executes `git commit -m "💡 feat: add rust support" -m "rewrite in rust"`
- **AND** displays the commit summary (Title, Description, Hash, Branch).

#### Scenario: Cancelled Commit
- **WHEN** the user cancels any prompt (Ctrl+C or Esc)
- **THEN** the process exits with `commit abort` message
- **AND** no git command is executed.

#### Scenario: No Message Validation
- **WHEN** the user attempts to submit an empty commit message
- **THEN** the prompt rejects the input and requires a non-empty string.

### Requirement: Commit Types
The CLI SHALL offer the standard list of conventional commit types with emojis.

#### Scenario: Type List
- **GIVEN** the prompt for commit type
- **THEN** the following options are available:
    - `feat` (💡)
    - `fix` (🪲)
    - `docs` (📝)
    - `style` (🚧)
    - `refactor` (🧬)
    - `perf` (⚡)
    - `test` (🧪)
    - `chore` (🧹)
    - `ci` (👷)
    - `release` (🎉)
    - `hotfix` (🚨)
