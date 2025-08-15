/**
 * Parse command line arguments
 * @returns {object} Parsed options object
 */
export function parseArgs() {
  const args = process.argv.slice(2);

  return {
    force: args.includes('--force'),
    dryRun: args.includes('--dry-run'),
    skipMcp: args.includes('--skip-mcp'),
    mcpOnly: args.includes('--mcp-only'),
    forceMcp: args.includes('--force-mcp'),
    help: args.includes('--help') || args.includes('-h'),
  };
}

/**
 * Show help message and exit
 * @param {string} helpText - Help text to display
 */
export function showHelp(helpText) {
  console.log(helpText);
  process.exit(0);
}

/**
 * Get user install help text
 * @returns {string} Help text for user-install command
 */
export function getUserInstallHelp() {
  return `
Usage: npx @hexium/claude-toolkit@latest user-install [options]

Options:
  --force       Force update all settings without prompting
  --dry-run     Show what would be changed without applying
  --skip-mcp    Skip MCP server configuration entirely
  --mcp-only    Configure only MCP servers (skip settings and templates)
  --force-mcp   Reconfigure MCP servers even if already installed
  --help, -h    Show this help message

Examples:
  npx @hexium/claude-toolkit@latest user-install
  npx @hexium/claude-toolkit@latest user-install --force
  npx @hexium/claude-toolkit@latest user-install --dry-run
  npx @hexium/claude-toolkit@latest user-install --skip-mcp
  npx @hexium/claude-toolkit@latest user-install --mcp-only
`;
}

/**
 * Get project install help text
 * @returns {string} Help text for project-install command
 */
export function getProjectInstallHelp() {
  return `
Usage: npx @hexium/claude-toolkit@latest project-install [options]

Options:
  --force     Force overwrite existing files
  --dry-run   Show what would be changed without applying
  --help, -h  Show this help message

Examples:
  npx @hexium/claude-toolkit@latest project-install
  npx @hexium/claude-toolkit@latest project-install --force
  npx @hexium/claude-toolkit@latest project-install --dry-run
`;
}
