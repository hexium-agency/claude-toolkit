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

- `.mcp.json`: Shared MCP configuration
- `settings.json`: Claude Code configuration with team standards, permissions, and status line setup
- `agents/accessibility-expert.md`: WCAG compliance and accessibility audit specialist
- `agents/context7-expert.md`: Live documentation retrieval to prevent AI hallucinations
- `agents/code-review-expert.md`: Comprehensive code quality, security, and performance review
- `agents/security-expert.md`: OWASP Top 10 vulnerability assessment and penetration testing
- `agents/performance-expert.md`: Core Web Vitals optimization and scalability analysis
- `commands/bump.md`: Smart version bump command with automatic semver analysis
- `commands/commit.md`: Custom commit command with conventional commit format
- `commands/document.md`: Intelligent documentation generator with inline/centralized options
- `commands/explain.md`: Code architecture and pattern explanation tool

### Team Standards (from settings.json)

- **Model**: Sonnet (claude-4-sonnet)
- **Default Mode**: Plan mode for complex tasks
- **Permissions**: Restricted bash commands (see Security Model below), MCP servers enabled
- **Status Line**: Integrated usage tracking via `npx ccusage@latest statusline`
- **Cleanup**: 10-day cleanup period for temporary files
- **Hooks**: Audio notifications for task completion and stops
- **Co-authoring**: Disabled by default

### MCP Configuration

**Included MCP Servers** (configured via `.mcp.json`):

- **ClickUp**: Task management integration (requires `CLICKUP_API_KEY` and `CLICKUP_TEAM_ID` environment variables)
- **Context7**: Documentation and library reference service
- **Sentry**: Error monitoring and debugging integration

**Environment Setup Required**:

```bash
# Add to ~/.zshrc or ~/.bashrc
export CLICKUP_API_KEY="your_clickup_api_key"
export CLICKUP_TEAM_ID="your_clickup_team_id"
```

## Development & Testing

**Requirements**:

- Node.js 18+ required
- Console output is in English
- Template-based approach ensures consistency across team projects

**Testing & Validation**:

- `npm test` runs `scripts/validate.js` to check template integrity
- Validates existence of required files: `settings.json`, `.mcp.json`
- Validates JSON syntax in all configuration files
- `npm run prepublishOnly` ensures validation passes before publishing

**Architecture Notes**:

- Installation script uses `findProjectRoot()` to locate target project directory
- Supports both `npm install` (via `postinstall`) and direct `npx claude-setup` execution
- Package designed for internal Hexium team use with GitHub repository integration

## Custom Commands

**HXM Bump Command (`commands/hxm/bump.md`)**:

- Smart version bumping with automatic semver analysis
- Analyzes commit history to suggest appropriate version increment (major/minor/patch)
- Supports Node.js, Rust, Python, and PHP projects
- Generates descriptive commit messages based on changes
- Follows conventional commit standards for version determination

**HXM Commit Command (`commands/hxm/commit.md`)**:

- Intelligent commit message generation using conventional commit format
- Supports `--all` flag to stage all changes or `--files` for specific files
- Analyzes git diffs to determine appropriate commit types (feat, fix, docs, etc.)
- Generates extended commit messages with descriptions for complex changes
- Restricted to essential git operations for security

**HXM Document Command (`commands/hxm/document.md`)**:

- Intelligent documentation generator with flexible output formats
- Supports inline documentation (JSDoc, docstrings) or centralized markdown docs
- Analyzes project structure to create only relevant documentation sections
- Brief mode for essential docs, detailed mode for comprehensive coverage
- Creates structured `/documentation/` folder with organized subject categories

**HXM Explain Command (`commands/hxm/explain.md`)**:

- Code architecture and pattern explanation tool
- Tailored explanations for different audiences (developer, architect, junior)
- Multiple explanation styles (technical deep-dive, visual diagrams, tutorials)
- Analyzes dependencies, design patterns, and system interactions
- Maps code relationships and data flow patterns

## Expert Agents System

**HXM Accessibility Expert (`agents/accessibility-expert.md`)**:

- WCAG 2.1/2.2 compliance audits with AA/AAA standards
- ARIA implementation and semantic HTML validation
- Keyboard navigation and screen reader compatibility testing
- Color contrast analysis and inclusive design recommendations
- Proactive triggering on web/mobile accessibility tasks

**HXM Context7 Expert (`agents/context7-expert.md`)**:

- Live documentation retrieval from official sources to prevent AI hallucinations
- Version-specific API usage and integration examples
- Framework-specific implementation patterns (React, Next.js, FastAPI, etc.)
- Migration guides and deprecation warnings
- Proactive triggering on library/framework mentions

**HXM Code Review Expert (`agents/code-review-expert.md`)**:

- Multi-layered security, performance, and quality analysis
- OWASP Top 10 security pattern detection
- Algorithm efficiency and database optimization review
- Design pattern validation and SOLID principles assessment
- Proactive triggering on git diffs and pre-commit reviews

**HXM Security Expert (`agents/security-expert.md`)**:

- OWASP Top 10 2023 vulnerability assessment and classification
- Dependency scanning for known CVEs and supply chain risks
- Secret detection and cryptographic implementation review
- Threat modeling using STRIDE methodology
- Proactive triggering on authentication, deployment, and security queries

**HXM Performance Expert (`agents/performance-expert.md`)**:

- Core Web Vitals optimization (LCP, FID, CLS) with specific targets
- Frontend bundle analysis and backend scalability assessment
- Database query optimization and caching strategy implementation
- Load testing framework design and capacity planning
- Proactive triggering on performance issues and optimization requests

## Security Model

**Allowed Operations**:

- File operations: `find`, `grep`, `rg`, `ls`, `glob`
- Safe git commands: `status`, `log`, `diff`
- MCP integrations: `clickup`, `context7`, `sentry`

**Denied Operations**:

- Network requests: `curl` and similar
- Environment files: `.env`, `.env.*`
- Secrets directory: `./secrets/**`
- Arbitrary bash commands (only specific patterns allowed)

**Override Capability**:

- Projects can create `.claude/settings.local.json` to override permissions
- Local settings take precedence over team defaults
- Use with caution to maintain security standards

## Installation Behavior

**File Management**:

- Always overwrites `settings.json` and command templates to maintain team standards
- Creates `.claude/` directory structure if it doesn't exist
- Installs files to namespace directories (`.claude/commands/hxm/`)
- Copies `.mcp.json` to project root for MCP server configuration

**Gitignore Management**:

- Automatically updates project `.gitignore` to exclude toolkit files
- Prevents toolkit files from appearing in PRs with entries for:
  - `.claude/settings.json`
  - `.claude/*/hxm/*`
  - `.mcp.json`

**Key Behaviors**:

- Installation preserves existing files (logs "Skipped (already exists)" for duplicates)
- Validation checks for required files: `settings.json`, `.mcp.json`, and command templates
- JSON configuration is validated for syntax errors
- Scripts use `#!/usr/bin/env node` for cross-platform compatibility
- Custom commands are installed with proper permissions and model configurations

## Troubleshooting

**Common Issues**:

**MCP Integration Not Working**:

- Verify environment variables are set: `echo $CLICKUP_API_KEY`
- Restart terminal after adding environment variables to shell profile
- Ensure `.mcp.json` exists in project root (installed automatically)

**Installation Issues**:

- Ensure Node.js 18+ is installed: `node --version`
- For permission issues, try: `npx claude-setup` instead of automatic postinstall
- Check that templates directory exists in installed package

**Validation Failures**:

- Run `npm test` to see specific validation errors
- Ensure all JSON files have valid syntax
- Verify required template files exist in `/templates/` directory
