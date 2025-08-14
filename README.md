# claude-toolkit

[![npm version](https://img.shields.io/npm/v/@hexium/claude-toolkit.svg)](https://www.npmjs.com/package/@hexium/claude-toolkit)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A standardized toolkit for Claude Code configurations across Hexium team projects. This package installs predefined templates and configurations to ensure consistent AI-assisted development practices.

## ✨ Features

- **Standardized Configuration**: Consistent Claude Code settings across all team projects
- **Security-First**: Pre-configured permissions with safe defaults
- **Expert Agents**: 5 specialized AI agents for accessibility, security, performance, code review, and documentation
- **Template System**: Ready-to-use agents, commands and configurations
- **Status Line Integration**: Built-in status line with usage tracking via ccusage
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
- `.mcp.json` - Shared MCP configuration
- `agents/hxm/` - Hexium team expert AI agents
- `commands/hxm/` - Hexium team custom commands

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
│   ├── agents/              # Expert agents templates
│   ├── commands/            # Custom commands templates
│   ├── settings.json        # Team configuration template
│   └── .mcp.json           # MCP server configuration
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
- **Status Line**: Integrated usage tracking with ccusage
- **Auto-commit**: Disabled by default

## 🤖 Expert Agents

The toolkit includes 5 specialized AI agents that activate automatically:

### 🎯 Accessibility Expert

- **WCAG 2.1/2.2 compliance** audits with AA/AAA standards
- **ARIA implementation** and semantic HTML validation
- **Keyboard navigation** and screen reader compatibility
- **Color contrast** analysis and inclusive design

### 📚 Context7 Expert

- **Live documentation** retrieval from official sources
- **Version-specific** API usage and examples
- **Framework integration** patterns (React, Next.js, FastAPI)
- **Migration guides** and deprecation warnings

### 🔍 Code Review Expert

- **Multi-layered analysis** of security, performance, and quality
- **OWASP Top 10** security pattern detection
- **Algorithm efficiency** and database optimization
- **Design patterns** and SOLID principles validation

### 🛡️ Security Expert

- **OWASP Top 10 2023** vulnerability assessment
- **Dependency scanning** for CVEs and supply chain risks
- **Secret detection** and crypto implementation review
- **Threat modeling** using STRIDE methodology

### ⚡ Performance Expert

- **Core Web Vitals** optimization (LCP, FID, CLS)
- **Bundle analysis** and backend scalability assessment
- **Database optimization** and caching strategies
- **Load testing** framework and capacity planning

## 🔧 Custom Commands

The toolkit includes 4 intelligent commands for development workflow:

### 📈 HXM Bump

- **Smart version bumping** with automatic semver analysis
- **Commit history analysis** to suggest appropriate increment (major/minor/patch)
- **Multi-language support** (Node.js, Rust, Python, PHP)
- **Conventional commit** message generation

### 💬 HXM Commit

- **Intelligent commit messages** using conventional commit format
- **Git diff analysis** to determine commit types (feat, fix, docs, etc.)
- **Staging options** with `--all` or `--files` flags
- **Extended descriptions** for complex changes

### 📚 HXM Document

- **Flexible documentation** generator (inline JSDoc/docstrings or centralized markdown)
- **Project structure analysis** for relevant documentation sections only
- **Organized output** in structured `/documentation/` folders
- **Brief/detailed modes** based on coverage needs

### 🔍 HXM Explain

- **Code architecture** and pattern explanation tool
- **Audience-tailored** explanations (developer, architect, junior)
- **Multiple formats** (technical deep-dive, visual diagrams, tutorials)
- **Dependency mapping** and data flow analysis

## 📊 Status Line Integration

The toolkit includes a built-in status line that displays usage information:

- **Command**: `npx ccusage@latest statusline`
- **Display**: Shows Claude Code usage metrics in the status line
- **Configuration**: Zero padding for clean display
- **Updates**: Automatically refreshes with latest usage data

The status line provides real-time insights into your Claude Code usage patterns and helps track project development metrics.

## 🔌 MCP Integration

Pre-configured MCP servers for enhanced Claude Code capabilities:

### 📋 ClickUp

- **Task management** integration with project workflows
- **Issue tracking** and team collaboration
- **Requirements**: `CLICKUP_API_KEY` and `CLICKUP_TEAM_ID` environment variables

### 📖 Context7

- **Live documentation** retrieval from official sources
- **Version-specific** API references and examples
- **Framework integration** patterns and best practices

### 🐛 Sentry

- **Error monitoring** and debugging integration
- **Performance tracking** and issue analysis
- **Production insights** for development workflow

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
