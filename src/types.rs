use std::fmt::{self, Display};

#[derive(Clone)]
pub struct CommitType {
    pub name: &'static str,
    pub emoji: &'static str,
    pub description: &'static str,
    pub value: &'static str,
}

impl Display for CommitType {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        // Format for the list: "💡 feat: A new feature"
        write!(f, "{} {}: {}", self.emoji, self.name, self.description)
    }
}

pub const COMMIT_TYPES: &[CommitType] = &[
    CommitType {
        name: "chore",
        emoji: "🧹",
        description: "Build process or auxiliary tool changes",
        value: "chore",
    },
    CommitType {
        name: "ci",
        emoji: "👷",
        description: "CI related changes",
        value: "ci",
    },
    CommitType {
        name: "docs",
        emoji: "📝",
        description: "Documentation only changes",
        value: "docs",
    },
    CommitType {
        name: "feat",
        emoji: "💡",
        description: "A new feature",
        value: "feat",
    },
    CommitType {
        name: "fix",
        emoji: "🐞",
        description: "A bug fix",
        value: "fix",
    },
    CommitType {
        name: "hotfix",
        emoji: "🚨",
        description: "Emergency fix",
        value: "hotfix",
    },
    CommitType {
        name: "perf",
        emoji: "⚡️",
        description: "A code change that improves performance",
        value: "perf",
    },
    CommitType {
        name: "refactor",
        emoji: "🧬",
        description: "A code change that neither fixes a bug or adds a feature",
        value: "refactor",
    },
    CommitType {
        name: "release",
        emoji: "🎉",
        description: "Create a release commit",
        value: "release",
    },
    CommitType {
        name: "style",
        emoji: "🚧",
        description: "Markup, white-space, formatting, missing semi-colons...",
        value: "style",
    },
    CommitType {
        name: "test",
        emoji: "🧪",
        description: "Adding missing tests",
        value: "test",
    },
];
