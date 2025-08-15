---
allowed-tools: Task, Bash(git add:*), Bash(git commit:*)
argument-hint: --all | --files <file1> <file2> ...
description: Smart git commit tool based on provided arguments or staged changes.
model: claude-3-5-sonnet-latest
---

# /hxm:commit - Smart git commit tool based on provided arguments or staged changes.

## Purpose

CRITICAL: Follow the Process section exactly - this tool analyzes staged changes, generates conventional commit messages, and executes git commits through a strict validation workflow. Do not diverge from the defined process.

## Usage

```bash
/hxm:commit [--all] [--files <file1> <file2> ...]
```

## Arguments

- No arguments: Work with already staged changes, or enter interactive selection if none staged
- `--all`: Stage all modified files with `git add .` before analyzing the diff
- `--files <file1> <file2> ...`: Stage only the specified files before analyzing the diff

## Process

**CRITICAL: This command handles argument parsing and git operations, then delegates message generation to commit-worker.**

1. **Parse Arguments**
   - If no arguments AND staged changes exist: Continue with already staged changes
   - If no arguments AND no staged changes: Enter interactive file selection
   - If both `--all` and `--files`: Exit with error like "Use either --all or --files, not both"
   - If `--all`: Stage all modified files with `git add .`
   - If `--files <file1> <file2> ...`: Stage specified files with `git add <files>`

2. **Interactive File Selection** (when no args + no staged changes)
   - Run `git status --porcelain` to get modified/untracked files
   - Display numbered list of files with their status (M=modified, A=added, D=deleted, ??=untracked)
   - Ask user to select files by numbers (e.g., "1,3,5" or "1-5" or "all")
   - Stage selected files with `git add <selected_files>`
   - If user selects nothing or cancels, exit with "No files selected for commit"

3. **Execute Git Add Operations**
   - Based on parsed arguments, execute the appropriate `git add` command
   - No staging operations if no arguments provided and staged changes exist

4. **Delegate Message Generation**
   - Launch git-message-writer agent to analyze staged changes and generate commit message
   - Writer will validate staged changes and return conventional commit message
   - If writer reports no changes, exit with error like "No changes to commit"

5. **Execute Commit**
   - Use the message returned by writer to execute `git commit -m "<message>"`
   - Report commit success or failure
