---
allowed-tools: Bash(git add:*), Bash(git status:*), Bash(git commit:*), Bash(git diff:*), Bash(git log:*)
argument-hint: --all | --files <file1> <file2> ...
description: Smart git commit tool based on provided arguments or staged changes.
model: claude-3-5-sonnet-latest
---

# /hxm:commit - Smart git commit tool based on provided arguments or staged changes.

## Purpose

Smart git commit tool that works as described in the Process section below.

## Usage

```bash
/hxm:commit [--all] [--files <file1> <file2> ...]
```

## Arguments

- `--all`: Stage all modified files with `git add .` before analyzing the diff
- `--files <file1> <file2> ...`: Stage only the specified files before analyzing the diff
- No arguments: Work with already staged changes only

## Process

**CRITICAL: This command MUST NOT execute in plan mode. If you are in plan mode (indicated by system reminders or restrictions on tool usage), immediately output the following error message and stop execution:**

"❌ Error: This command cannot run in plan mode. Please exit plan mode first to execute git operations."

**Only proceed with the following steps if you are NOT in plan mode:**

1. **Argument Processing**
   - If both `--all` and `--files` are provided: Exit with error "Cannot use --all and --files together"
   - If `--all` is provided: Stage all modified files with `git add .`
   - If `--files <file1> <file2>` is provided: Stage only specified files with `git add <files>`
   - If no arguments: Proceed with existing staged changes only

2. **Validation Check**
   - Run `git diff --cached` to check staged changes
   - **CRITICAL: If NO staged changes exist: Stop and inform user "No staged changes found. Use --all, --files, or manually stage changes first."**
   - If staged changes exist: Continue to step 3 with the diff in memory

3. **Commit Generation**
   - Analyze the staged diff to determine appropriate commit type (feat, fix, docs, refactor, style, test, chore, etc.)
   - Generate conventional commit message following the format described in the Notes section below
   - Execute the commit using `git commit -m "<message>"`
   - If the commit succeeds, display success confirmation
   - If the commit fails, display the error message and exit

## Notes

### Commit Message Format

Follows Git Conventional Commits format with optional descriptions for additional context:

#### Basic Format

- `feat(scope): add new feature`
- `fix(scope): resolve bug in component`
- `docs(scope): update documentation`
- `refactor(scope): restructure code without changing behavior`
- `style(scope): formatting changes`
- `test(scope): add or update tests`
- `chore(scope): maintenance tasks`

#### Extended Format with Description

For complex changes that need additional context, the command can generate multi-line commit messages with descriptions:

- `feat(auth): add user authentication`

  `Implement JWT-based authentication with refresh tokens and role-based access control`

- `fix(ui): resolve button alignment issue`

  `Adjust flexbox properties to properly center action buttons across different screen sizes`

- `refactor(api): restructure user service`

  `Split monolithic user service into separate authentication and profile management modules for better maintainability`

#### Guidelines

- The scope should reflect the area of the codebase being changed (e.g., api, ui, docs, config)
- The command automatically determines when additional description is needed based on the complexity and nature of the changes
- Descriptions provide context about the "why" and "how" of the changes, complementing the concise subject line
