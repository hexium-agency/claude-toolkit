#!/usr/bin/env node
import path from 'path';
import fs from 'fs';
import os from 'os';
import { fileURLToPath } from 'url';
import {
  createDirectory,
  copyFile,
  copyDirectoryFiles,
} from '../lib/file-utils.js';
import { mergeSettings } from '../lib/settings-merger.js';

//#region Constants

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Global installation configuration
const GLOBAL_CONFIG = {
  // Files to copy to ~/.claude directory
  claudeFiles: [{ src: '.mcp.json', dest: '.mcp.json' }],

  // Subdirectories to create and fill with Hexium templates
  subDirs: ['agents', 'commands'],
};

//#endregion Constants

//#region Main

console.log('🌍 Starting global installation of Hexium Claude toolkit...');

// Parse command line arguments
const args = process.argv.slice(2);
const options = {
  force: args.includes('--force'),
  dryRun: args.includes('--dry-run'),
};

// Show help if requested
if (args.includes('--help') || args.includes('-h')) {
  console.log(`
Usage: npx @hexium/claude-toolkit@latest global-install [options]

Options:
  --force     Force update all settings without prompting
  --dry-run   Show what would be changed without applying
  --help, -h  Show this help message

Examples:
  npx @hexium/claude-toolkit@latest global-install
  npx @hexium/claude-toolkit@latest global-install --force
  npx @hexium/claude-toolkit@latest global-install --dry-run
`);
  process.exit(0);
}

try {
  await installGlobal(options);
} catch (error) {
  console.error('❌ Installation failed:', error.message);
  process.exit(1);
}

//#endregion Main

//#region Functions

function getTemplatesDir() {
  return path.join(__dirname, '..', 'templates');
}

function getUserClaudeDir() {
  return path.join(os.homedir(), '.claude');
}

function copyNamespaceFiles(templatesDir, claudeDir) {
  GLOBAL_CONFIG.subDirs.forEach(subDir => {
    const srcSubDir = path.join(templatesDir, subDir);
    const destSubDirBase = path.join(claudeDir, subDir);
    const destNamespaceDir = path.join(destSubDirBase, 'hxm');

    // Create subdirectory if it doesn't exist
    if (createDirectory(destSubDirBase)) {
      console.log(`📁 ~/.claude/${subDir} directory created`);
    }

    // Create namespace directory if it doesn't exist
    if (createDirectory(destNamespaceDir)) {
      console.log(`📁 ~/.claude/${subDir}/hxm directory created`);
    }

    // Copy all files from template subdirectory to namespace directory
    copyDirectoryFiles(srcSubDir, destNamespaceDir, 'hxm');
  });
}

function copyGlobalMcpFile(templatesDir, claudeDir) {
  const srcPath = path.join(templatesDir, '.mcp.json');
  const destPath = path.join(claudeDir, '.mcp.json');
  copyFile(srcPath, destPath, '.mcp.json (in ~/.claude/)');
}

async function handleGlobalSettingsInstallation(
  templatesDir,
  claudeDir,
  options
) {
  const settingsTemplatePath = path.join(templatesDir, 'settings.json');
  const settingsTargetPath = path.join(claudeDir, 'settings.json');

  let toolkitSettings;
  try {
    toolkitSettings = JSON.parse(fs.readFileSync(settingsTemplatePath, 'utf8'));
  } catch (error) {
    console.error('❌ Error reading toolkit settings template:', error.message);
    return;
  }

  await mergeSettings(settingsTargetPath, toolkitSettings, options);
}

async function installGlobal(options = {}) {
  console.log('🌍 Installing Claude Code toolkit globally...');

  const templatesDir = getTemplatesDir();
  const claudeDir = getUserClaudeDir();

  // Create ~/.claude directory
  const created = createDirectory(claudeDir);
  if (created) {
    console.log('📁 ~/.claude directory created');
  }

  await handleGlobalSettingsInstallation(templatesDir, claudeDir, options);

  copyNamespaceFiles(templatesDir, claudeDir);

  copyGlobalMcpFile(templatesDir, claudeDir);

  console.log('✅ Global installation completed!');
  console.log('💡 Global Hexium templates installed in ~/.claude/');
}

//#endregion Functions
