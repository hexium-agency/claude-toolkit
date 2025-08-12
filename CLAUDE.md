# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is `claude-toolkit`, an npm package that standardizes Claude Code configurations across Hexium team projects. It installs predefined templates and configurations to ensure consistent AI-assisted development practices.

## Common Commands

- `npm test` - Validates template integrity and required files
- `npm run prepublishOnly` - Runs validation before publishing
- `npx claude-setup` - Installs toolkit templates to target project's `.claude/` directory
- `npx claude-sync` - Updates existing installations with latest templates
- `npx claude-validate` - Validates that all required template files exist and are valid

## Architecture

### Core Components

**Installation System (`/bin/claude-setup.js`)**:
- Copies templates from `/templates/` to target project's `.claude/` directory
- Uses recursive copying with existence checks (never overwrites existing files)
- Creates `.claude/` directory if it doesn't exist

**Maintenance Scripts (`/scripts/`)**:
- `sync.js`: Re-runs installation to update templates
- `validate.js`: Ensures required files exist and JSON syntax is valid

**Template System (`/templates/`)**:
- `.claude-config.json`: Team configuration with default prompts, settings, and standards
- `prompts/code-review.md`: Standardized code review prompt template

### Team Standards (from .claude-config.json)

- **Code Style**: Prettier
- **Test Framework**: Jest  
- **Documentation**: JSDoc
- **Model**: claude-sonnet-4
- **Auto-commit**: Disabled by default

## Development Notes

- Requires Node.js 18+
- Console output is in English
- Template-based approach ensures consistency across team projects
- Validation prevents broken installations
- Package is designed for internal team use with specific GitHub repository structure

## Key Behaviors

- Installation preserves existing files (logs "Skipped (already exists)" for duplicates)
- Validation checks for required files: `.claude-config.json` and `prompts/code-review.md`
- JSON configuration is validated for syntax errors
- Scripts use `#!/usr/bin/env node` for cross-platform compatibility