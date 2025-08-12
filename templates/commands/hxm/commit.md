---
allowed-tools: Bash(git add:*), Bash(git status:*), Bash(git commit:*), Bash(git diff:*), Bash(git log:*)
argument-hint: --all | --files <file1> <file2> ...
description: Commit changes with a diff analysis for the commit message.
model: claude-3-5-haiku-latest
---

Based on #$ARGUMENTS changes, generate a commit message following Git Conventional Commits format.

## Purpose

Smart git commit tool that works with staged changes or stages files on demand. Analyzes diffs, generates conventional commit messages, and creates commits. Use --all to stage everything, --files for specific files, or run without flags to work with already staged changes.

## Usage

```bash
/commit [--all] [--files <file1> <file2> ...]
```

## Arguments

- `--all`: Stage all modified files with `git add .` before analyzing the diff
- `--files <file1> <file2> ...`: Stage only the specified files before analyzing the diff
- No arguments: Work with already staged changes only

## Process

1. Parse command arguments:
   - If both `--all` and `--files` are provided: Exit with error message "Cannot use --all and --files together"
   - If `--all` is provided: Run `git add .` to stage all changes
   - If `--files` is provided: Run `git add [specified files]` to stage only those files
   - If no arguments: Work with already staged changes
2. **MANDATORY: Check the diff with `git diff --cached`**:
   - If there are NO staged changes to commit, STOP immediately and inform the user "No staged changes found. Please stage files first with 'git add' or use --all/--files flags"
   - If there ARE staged changes: Continue to step 4
3. Determine the appropriate commit type (feat, fix, docs, refactor, style, test, chore, etc.) based on the changes
4. Generate a descriptive commit message following the format explained below
5. Create a short commit description (1-2 sentences) explaining the purpose of the changes
6. Create the commit with both message and description

## Commit Message Format

Follows Git Conventional Commits:

- `feat(scope): add new feature`
- `fix(scope): resolve bug in component`
- `docs(scope): update documentation`
- `refactor(scope): restructure code without changing behavior`
- `style(scope): formatting changes`
- `test(scope): add or update tests`
- `chore(scope): maintenance tasks`

The scope should reflect the area of the codebase being changed (e.g., api, ui, docs, config).
