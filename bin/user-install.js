#!/usr/bin/env node
import { parseArgs, showHelp, getUserInstallHelp } from '../lib/cli-utils.js';
import { getUserClaudeDir, getTemplatesDir } from '../lib/path-resolver.js';
import { copyNamespaceFiles } from '../lib/template-manager.js';
import { configureMcpServers } from '../lib/mcp-manager.js';
import { handleUserSettingsInstallation } from '../lib/user-installer.js';

// User installation configuration
const USER_CONFIG = {
  // Subdirectories to create and fill with Hexium templates
  subDirs: ['agents', 'commands'],
};

console.log('🌍 Starting user installation of Hexium Claude toolkit...');

try {
  const options = parseArgs();
  if (options.help) showHelp(getUserInstallHelp());

  // Explicit orchestration steps
  console.log('🌍 Installing Claude Code toolkit for user...');

  const templatesDir = getTemplatesDir();
  const claudeDir = getUserClaudeDir();

  if (options.mcpOnly) {
    // MCP-only mode: skip settings and templates
    console.log('🔧 MCP-only mode: configuring MCP servers only');
    await configureMcpServers(templatesDir, options);
    console.log('✅ User installation completed!');
    process.exit(0);
  }

  // Step 1: Settings installation
  console.log('🔧 Configuring user settings...');
  await handleUserSettingsInstallation(templatesDir, claudeDir, options);

  // Step 2: Templates copy
  console.log('📁 Installing templates...');
  copyNamespaceFiles(templatesDir, claudeDir, USER_CONFIG.subDirs);

  // Step 3: MCP installation
  console.log('🔧 Configuring MCP servers...');
  await configureMcpServers(templatesDir, options);

  console.log('✅ User installation completed!');
  console.log('💡 User Hexium templates installed in ~/.claude/');
} catch (error) {
  console.error('❌ Installation failed:', error.message);
  process.exit(1);
}
