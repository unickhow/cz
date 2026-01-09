use anyhow::{Context, Result};
use clap::Parser;
use console::style;
use inquire::{Select, Text};
use std::process::Command;

mod types;
use types::COMMIT_TYPES;

#[derive(Parser)]
#[command(name = "cz")]
#[command(about = "rough commitizen", long_about = None)]
struct Cli {}

fn main() -> Result<()> {
    // Parse args to ensure help works
    let _cli = Cli::parse();

    // 1. Select Commit Type
    let selected_type = Select::new("Pick a commit type.", COMMIT_TYPES.to_vec())
        .with_page_size(10)
        .prompt()
        // If user cancels (Ctrl+C), inquire returns Err. We handle meaningful cancel vs error?
        // Inquire error can be Canceled.
        .map_err(|e| {
            if matches!(e, inquire::InquireError::OperationCanceled) {
                // Return a specific error or just exit gracefully?
                // Original: console.log(picocolors.magenta(' commit abort. '))
                eprintln!("{}", style(" commit abort. ").magenta());
                std::process::exit(0);
            }
            e
        })
        .context("Failed to select commit type")?;

    // 2. Commit Message
    let message_prompt = format!("{} {}", selected_type.emoji, selected_type.name);

    let commit_message = Text::new(&message_prompt)
        .with_validator(|input: &str| {
            if input.trim().is_empty() {
                Ok(inquire::validator::Validation::Invalid(
                    "Commit message is required.".into(),
                ))
            } else {
                Ok(inquire::validator::Validation::Valid)
            }
        })
        .prompt()
        .map_err(|e| {
            if matches!(e, inquire::InquireError::OperationCanceled) {
                eprintln!("{}", style(" commit abort. ").magenta());
                std::process::exit(0);
            }
            e
        })
        .context("Failed to get commit message")?;

    // 3. Commit Description
    let commit_description = Text::new("Commit description (optional)")
        .with_validator(|input: &str| {
            if input.chars().count() > 100 {
                Ok(inquire::validator::Validation::Invalid(
                    "Description is too long.".into(),
                ))
            } else {
                Ok(inquire::validator::Validation::Valid)
            }
        })
        .prompt()
        .map_err(|e| {
            if matches!(e, inquire::InquireError::OperationCanceled) {
                eprintln!("{}", style(" commit abort. ").magenta());
                std::process::exit(0);
            }
            e
        })
        .context("Failed to get commit description")?;

    // Construct commit title
    let commit_title = format!(
        "{} {}: {}",
        selected_type.emoji, selected_type.value, commit_message
    );

    // 4. Git Commit
    let mut args = vec!["commit", "-m", &commit_title];
    if !commit_description.trim().is_empty() {
        args.push("-m");
        args.push(&commit_description);
    }

    // Execute git
    let output = Command::new("git")
        .args(&args)
        .output()
        .context("Failed to execute git commit")?;

    // 5. Output
    println!(
        "{}",
        style("-----------------------------------------------------------").dim()
    );

    if !output.stdout.is_empty() {
        println!(
            "{}",
            style(String::from_utf8_lossy(&output.stdout).trim()).dim()
        );
    }

    // Git usually prints to stdout for success, but stderr for some info or errors.
    // We print stderr if it exists.
    if !output.stderr.is_empty() {
        if !output.stdout.is_empty() {
            println!(
                "{}",
                style("-----------------------------------------------------------").dim()
            );
        }
        // If git failed (exit code != 0), we might want to print stderr brightly?
        // Original logic printed dim stderr.
        if output.status.success() {
            println!(
                "{}",
                style(String::from_utf8_lossy(&output.stderr).trim()).dim()
            );
        } else {
            println!(
                "{}",
                style(String::from_utf8_lossy(&output.stderr).trim()).red()
            );
        }
    }

    println!(
        "{}",
        style("-----------------------------------------------------------").dim()
    );

    if output.status.success() {
        println!(
            "{} {}",
            style(" Title       ")
                .bg(console::Color::Green)
                .black()
                .bold(),
            style(&commit_title).green()
        );
        if !commit_description.trim().is_empty() {
            println!(
                "{} {}",
                style(" Description ")
                    .bg(console::Color::Green)
                    .black()
                    .bold(),
                style(&commit_description).green()
            );
        }

        let stdout = String::from_utf8_lossy(&output.stdout);
        // Try to find [master 1234567] pattern
        if let Some(start) = stdout.find('[') {
            if let Some(end) = stdout[start..].find(']') {
                let content = &stdout[start + 1..start + end];
                println!(
                    "{} {}",
                    style(" Commit hash ")
                        .bg(console::Color::Green)
                        .black()
                        .bold(),
                    style(format!(" {} ", content)).cyan().bold()
                );
            }
        }
    } else {
        println!(
            "{}",
            style(" No changes added to commit. ")
                .bg(console::Color::Red)
                .black()
        );
    }

    Ok(())
}
