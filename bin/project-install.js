#!/usr/bin/env node
import {
  parseArgs,
  showHelp,
  getProjectInstallHelp,
} from '../lib/cli-utils.js';
import {
  getProjectRoot,
  getTemplatesDir,
  getTargetClaudeDir,
} from '../lib/path-resolver.js';
import { createDirectory, updateGitignore } from '../lib/file-utils.js';
import {
  copyClaudeFiles,
  copyProjectNamespaceFiles,
  copyRootFiles,
} from '../lib/project-installer.js';
import { configureProjectMcpServers } from '../lib/mcp-manager.js';

// Project installation configuration
const PROJECT_CONFIG = {
  // Files to copy to .claude directory
  claudeFiles: [{ src: 'settings.json', dest: 'settings.json' }],

  // Files to copy to project root
  rootFiles: [{ src: '.mcp.json', dest: '.mcp.json' }],

  // Subdirectories to create and fill with Hexium templates
  subDirs: ['agents', 'commands'],

  // Gitignore entries to add
  gitignoreEntries: [
    '# Ignore Hexium toolkit settings to prevent noise in PRs',
    '.claude/settings.json',
    '.claude/*/hxm/*',
    '.mcp.json',
  ],
};

console.log('🔧 Starting project installation of Hexium Claude toolkit...');

async function installProject() {
  try {
    const options = parseArgs();
    if (options.help) showHelp(getProjectInstallHelp());

    // Explicit orchestration steps
    console.log('🔧 Installing Claude Code toolkit for project...');

    const templatesDir = getTemplatesDir();
    const projectRoot = getProjectRoot();
    const claudeDir = getTargetClaudeDir();

    // Step 1: Settings installation
    console.log('📁 Setting up project directories...');
    if (createDirectory(claudeDir)) {
      console.log('📁 .claude directory created');
    }
    copyClaudeFiles(templatesDir, claudeDir, PROJECT_CONFIG);

    // Step 2: Templates copy
    console.log('📄 Installing templates...');
    copyProjectNamespaceFiles(templatesDir, claudeDir, PROJECT_CONFIG);

    // Step 3: Root files and gitignore
    console.log('⚙️ Configuring project files...');
    copyRootFiles(templatesDir, projectRoot, PROJECT_CONFIG);
    updateGitignore(projectRoot, PROJECT_CONFIG.gitignoreEntries);

    // Step 4: MCP configuration
    console.log('🔧 Configuring MCP servers...');
    await configureProjectMcpServers(templatesDir, options);

    console.log('✅ Project installation completed!');
    console.log('💡 Hexium templates are available in .claude/*/hxm/');
  } catch (error) {
    console.error('❌ Installation failed:', error.message);
    process.exit(1);
  }
}

installProject();
