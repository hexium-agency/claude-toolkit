---
allowed-tools: Bash(git add:*), Bash(git status:*), Bash(git commit:*), Bash(git diff:*), Bash(git log:*)
argument-hint: all | files <file1> <file2> ...
description: Commit changes with a diff analysis for the commit message.
model: claude-3-5-haiku-latest
---

Based on #$ARGUMENTS changes, generate a commit message following Git Conventional Commits format.

## Purpose

Automatically stages all modified files, analyzes the diff, generates a commit message following Git Conventional Commits format, and creates a commit.

## Usage

```bash
/commit [--all] [--files file1 file2] # Stage specific files and commit
```

## Arguments

- `--all`: Stage all modified files with `git add .` before analyzing the diff
- `--files <file1> <file2> ...`: Stage only the specified files before analyzing the diff
- No arguments: Work with already staged changes only

## Process

1. Parse command arguments:
   - If `--all` is provided: Run `git add .` to stage all changes
   - If `--files` is provided: Run `git add [specified files]` to stage only those files
   - If no arguments: Work with already staged changes
2. Check the diff with `git diff --cached`, analyze all staged changes
3. If there are no changes, exit with a message
4. Determine the appropriate commit type (feat, fix, docs, refactor, style, test, chore, etc.) based on the changes
5. Generate a descriptive commit message following the format explained below
6. Create a short commit description (1-2 sentences) explaining the purpose of the changes
7. Create the commit with both message and description

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
