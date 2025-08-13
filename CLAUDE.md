# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is `claude-toolkit`, an npm package that standardizes Claude Code configurations across Hexium team projects. It installs predefined templates and configurations to ensure consistent AI-assisted development practices.

## Common Commands

- `npm test` - Validates template integrity and required files
- `npm run prepublishOnly` - Runs validation before publishing
- `npx claude-setup` - Installs toolkit templates to target project's `.claude/` directory

## Architecture

### Core Components

**Installation System (`/bin/claude-setup.js`)**:
- Copies templates from `/templates/` to target project's `.claude/` directory
- Uses recursive copying with existence checks (never overwrites existing files)
- Creates `.claude/` directory if it doesn't exist

**Maintenance Scripts (`/scripts/`)**:
- `validate.js`: Ensures required files exist and JSON syntax is valid

**Template System (`/templates/`)**:
- `settings.json`: Claude Code configuration with team standards and permissions
- `commands/hxm/commit.md`: Custom commit command with conventional commit format

### Team Standards (from settings.json)

- **Model**: Sonnet (claude-3-5-sonnet)
- **Default Mode**: Plan mode for complex tasks
- **Permissions**: Restricted bash commands, MCP servers enabled (ClickUp, Context7, Sentry)
- **Cleanup**: 10-day cleanup period for temporary files
- **Hooks**: Audio notifications for task completion and stops
- **Co-authoring**: Disabled by default

## Development Notes

- Requires Node.js 18+
- Console output is in English
- Template-based approach ensures consistency across team projects
- Validation prevents broken installations
- Package is designed for internal team use with specific GitHub repository structure

## Custom Commands

**HXM Commit Command (`commands/hxm/commit.md`)**:
- Intelligent commit message generation using conventional commit format
- Supports `--all` flag to stage all changes or `--files` for specific files
- Uses Claude 3.5 Haiku for fast commit message generation
- Analyzes git diffs to determine appropriate commit types (feat, fix, docs, etc.)
- Restricted to essential git operations for security

## Key Behaviors

- Installation preserves existing files (logs "Skipped (already exists)" for duplicates)
- Validation checks for required files: `settings.json` and `commands/hxm/commit.md`
- JSON configuration is validated for syntax errors
- Scripts use `#!/usr/bin/env node` for cross-platform compatibility
- Custom commands are installed with proper permissions and model configurations