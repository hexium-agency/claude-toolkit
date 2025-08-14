#!/usr/bin/env node
import path from 'path';
import { fileURLToPath } from 'url';
import {
  createDirectory,
  copyFile,
  copyDirectoryFiles,
  updateGitignore,
} from '../lib/file-utils.js';

//#region Constants

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

//#endregion Constants

//#region Main

console.log('🔧 Starting project installation of Hexium Claude toolkit...');

// Parse command line arguments
const args = process.argv.slice(2);
const options = {
  force: args.includes('--force'),
  dryRun: args.includes('--dry-run'),
};

// Show help if requested
if (args.includes('--help') || args.includes('-h')) {
  console.log(`
Usage: npx @hexium/claude-toolkit@latest project-install [options]

Options:
  --force     Force overwrite existing files
  --dry-run   Show what would be changed without applying
  --help, -h  Show this help message

Examples:
  npx @hexium/claude-toolkit@latest project-install
  npx @hexium/claude-toolkit@latest project-install --force
  npx @hexium/claude-toolkit@latest project-install --dry-run
`);
  process.exit(0);
}

try {
  await installProject(options);
} catch (error) {
  console.error('❌ Installation failed:', error.message);
  process.exit(1);
}

//#endregion Main

//#region Functions

function getTemplatesDir() {
  return path.join(__dirname, '..', 'templates');
}

function getProjectRoot() {
  let projectRoot = process.env.INIT_CWD || process.cwd();

  if (!process.env.INIT_CWD) {
    let current = __dirname;
    while (current !== '/' && !current.includes('node_modules')) {
      current = path.dirname(current);
    }

    if (current.includes('node_modules')) {
      const nodeModulesPath = current.substring(
        0,
        current.indexOf('node_modules')
      );
      projectRoot = nodeModulesPath || process.cwd();
    }
  }

  return projectRoot;
}

function getTargetClaudeDir() {
  const projectRoot = getProjectRoot();
  return path.join(projectRoot, '.claude');
}

function copyClaudeFiles(templatesDir, claudeDir) {
  PROJECT_CONFIG.claudeFiles.forEach(({ src, dest }) => {
    const srcPath = path.join(templatesDir, src);
    const destPath = path.join(claudeDir, dest);
    copyFile(srcPath, destPath, dest);
  });
}

function copyNamespaceFiles(templatesDir, claudeDir) {
  PROJECT_CONFIG.subDirs.forEach(subDir => {
    const srcSubDir = path.join(templatesDir, subDir);
    const destSubDirBase = path.join(claudeDir, subDir);
    const destNamespaceDir = path.join(destSubDirBase, 'hxm');

    // Create subdirectory if it doesn't exist
    if (createDirectory(destSubDirBase)) {
      console.log(`📁 .claude/${subDir} directory created`);
    }

    // Create namespace directory if it doesn't exist
    if (createDirectory(destNamespaceDir)) {
      console.log(`📁 .claude/${subDir}/hxm directory created`);
    }

    // Copy all files from template subdirectory to namespace directory
    copyDirectoryFiles(srcSubDir, destNamespaceDir, 'hxm');
  });
}

function copyRootFiles(templatesDir, projectRoot) {
  PROJECT_CONFIG.rootFiles.forEach(({ src, dest }) => {
    const srcPath = path.join(templatesDir, src);
    const destPath = path.join(projectRoot, dest);
    copyFile(srcPath, destPath, `${dest} (at project root)`);
  });
}

async function installProject() {
  console.log('🔧 Installing Claude Code toolkit for project...');

  const templatesDir = getTemplatesDir();
  const projectRoot = getProjectRoot();
  const claudeDir = getTargetClaudeDir();

  // Create .claude directory
  const created = createDirectory(claudeDir);
  if (created) {
    console.log('📁 .claude directory created');
  }

  copyClaudeFiles(templatesDir, claudeDir);

  copyNamespaceFiles(templatesDir, claudeDir);

  copyRootFiles(templatesDir, projectRoot);

  updateGitignore(projectRoot, PROJECT_CONFIG.gitignoreEntries);

  console.log('✅ Project installation completed!');
  console.log('💡 Hexium templates are available in .claude/*/hxm/');
}

//#endregion Functions
