---
allowed-tools: Task
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

- No arguments: Work with already staged changes only
- `--all`: Stage all modified files with `git add .` before analyzing the diff
- `--files <file1> <file2> ...`: Stage only the specified files before analyzing the diff

## Process

**CRITICAL: This command delegates to the commit-worker agent to avoid context interference.**

First, parse the arguments provided to this command, then immediately use the Task tool to launch the commit-worker agent.

Arguments parsing:

- If no arguments provided: Pass "no arguments" to the worker
- If --all is provided: Pass "--all" to the worker
- If --files is provided with file list: Pass "--files" and the complete file list to the worker

Then launch the commit-worker with:

```
Execute the git commit workflow with the parsed arguments:
- Arguments: [the actual parsed arguments from above]
- Process these arguments according to your specifications
- Follow the exact validation and commit generation process
- Use only staged changes from git diff --cached
- Generate conventional commit messages
- Execute the commit and report results
```

The commit-worker agent will handle the complete commit workflow in a clean environment without external context interference.
