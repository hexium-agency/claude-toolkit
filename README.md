# claude-toolkit

[![npm version](https://img.shields.io/npm/v/@hexium/claude-toolkit.svg)](https://www.npmjs.com/package/@hexium/claude-toolkit)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A standardized toolkit for Claude Code configurations across Hexium team projects. This package installs predefined templates and configurations to ensure consistent AI-assisted development practices.

## ✨ Features

- **Standardized Configuration**: Consistent Claude Code settings across all team projects
- **Security-First**: Pre-configured permissions with safe defaults
- **Template System**: Ready-to-use agents, commands and configurations
- **Easy Installation**: One-command setup for new projects

## 📦 Installation

```bash
npm install --save-dev @hexium-agency/claude-toolkit
```

### Requirements

- Node.js 18.0.0 or higher
- npm or yarn package manager

## 🚀 Usage

### Initial Setup

After installation, the toolkit automatically runs setup:

```bash
npx claude-setup
```

This creates a `.claude/` directory in your project with:

- `settings.json` - Team configuration with permissions and defaults
- `{agents|commands}/hxm` - Team folders for custom agents and commands

## ⚙️ Configuration

### MCP Environment Variables

The toolkit includes MCP server integrations that may require environment variables. Add these to your global shell profile:

```bash
# ~/.zshrc or ~/.bashrc
export CLICKUP_API_KEY="your_clickup_api_key"
export CLICKUP_TEAM_ID="your_clickup_team_id"
```

After adding these variables, restart your terminal or run:

```bash
source ~/.zshrc  # or ~/.bashrc
```

### Important: Settings Management

**⚠️ DO NOT edit `.claude/settings.json` directly!**

The `settings.json` file contains team-wide standards and should remain unchanged as it will be overwritten by the setup script. For project-specific customizations, create a `.claude/settings.local.json` file:

```bash
# Create local settings override
touch .claude/settings.local.json
```

Example `.claude/settings.local.json`:

```json
{
  "permissions": {
    "allow": ["Bash(npm:dev)", "Bash(docker:*)"]
  },
  "model": "opus"
}
```

**Configuration Hierarchy:**

1. `.claude/settings.local.json` (highest priority)
2. `.claude/settings.json` (team defaults)

### Default Permissions

The toolkit includes safe default permissions:

**Allowed:**

- Basic file operations (`find`, `grep`, `rg`, `ls`)
- Safe git commands (`status`, `log`, `diff`)
- MCP integrations (`clickup`, `context7`, `sentry`)

**Denied:**

- Network requests (`curl`)
- Environment files (`.env`, `.env.*`)
- Secrets directory (`./secrets/**`)

## 📁 Project Structure

```
claude-toolkit/
├── bin/
│   └── claude-setup.js      # Installation script
├── scripts/
│   └── validate.js          # Validation script
├── templates/
│   └── agents/              # Custom agents templates
│   └── commands/            # Custom commands templates
│   └── settings.json        # Team configuration template
└── README.md
```

## 🛠 Development Scripts

```bash
# Validate installation
npm test

# Re-run setup (updates templates)
npx claude-setup

# Validate configuration
npx claude-validate
```

## 🏗 Team Standards

This toolkit enforces Hexium team standards:

- **Model**: Claude Sonnet 4 default
- **Default Mode**: Plan mode for complex tasks
- **Auto-commit**: Disabled by default

## 🤝 Contributing

This is an internal Hexium team tool. For issues or suggestions:

1. Open an issue at [GitHub Issues](https://github.com/hexium-agency/claude-toolkit/issues)
2. Follow team development standards
3. Test changes with `npm test`

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

## 🔗 Links

- [GitHub Repository](https://github.com/hexium-agency/claude-toolkit)
- [npm Package](https://www.npmjs.com/package/@hexium/claude-toolkit)
- [Hexium Agency](https://hexium.io)

---

**Made with ❤️ by the Hexium Team**
