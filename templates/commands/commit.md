---
allowed-tools: Bash(git add:*), Bash(git status:*), Bash(git commit:*), Bash(git diff:*), Bash(git log:*)
argument-hint: --all | --files <file1> <file2> ...
description: Generate and execute git commit with conventional commit message based on provided arguments and staged changes.
model: claude-3-5-haiku-latest
---

Based on #$ARGUMENTS changes, generate a commit message following Git Conventional Commits format.

## Purpose

Smart git commit tool that works with staged changes or stages files on demand. Analyzes diffs, generates conventional commit messages, and creates commits. Use --all to stage everything, --files for specific files, or run without flags to work with already staged changes.

## Usage

```bash
# In claude prompt, use the following command to commit changes:
/hxm:commit [--all] [--files <file1> <file2> ...]
```

## Arguments

- `--all`: Stage all modified files with `git add .` before analyzing the diff
- `--files <file1> <file2> ...`: Stage only the specified files before analyzing the diff
- No arguments: Work with already staged changes only

## Process

**IMPORTANT: This command is self-contained and handles all required git operations automatically.**

### Step 1: Argument Processing
- If both `--all` and `--files` are provided: Exit with error "Cannot use --all and --files together"
- If `--all` is provided: Stage all modified files with `git add .`
- If `--files <file1> <file2>` is provided: Stage only specified files with `git add <files>`
- If no arguments: Proceed with existing staged changes only

### Step 2: Validation Check
Run `git diff --cached` to check staged changes:
- **If NO staged changes exist**: Stop and inform user "No staged changes found. Use --all, --files, or manually stage changes first."
- **If staged changes exist**: Continue to commit process

### Step 3: Commit Generation
Only when staged changes are confirmed:
1. Analyze the diff to determine appropriate commit type (feat, fix, docs, refactor, style, test, chore, etc.)
2. Generate conventional commit message following the format below
3. Create commit with generated message

**DO NOT perform any git operations beyond what is explicitly required by the provided arguments.**

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
