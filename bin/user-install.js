#!/usr/bin/env node
import path from 'path';
import fs from 'fs';
import os from 'os';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';
import { promisify } from 'util';
import inquirer from 'inquirer';
import { createDirectory, copyDirectoryFiles } from '../lib/file-utils.js';
import { mergeSettings } from '../lib/settings-merger.js';

const execAsync = promisify(exec);

//#region Constants

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// User installation configuration
const USER_CONFIG = {
  // Subdirectories to create and fill with Hexium templates
  subDirs: ['agents', 'commands'],
};

//#endregion Constants

//#region Main

console.log('🌍 Starting user installation of Hexium Claude toolkit...');

// Parse command line arguments
const args = process.argv.slice(2);
const options = {
  force: args.includes('--force'),
  dryRun: args.includes('--dry-run'),
  skipMcp: args.includes('--skip-mcp'),
  mcpOnly: args.includes('--mcp-only'),
  forceMcp: args.includes('--force-mcp'),
};

// Show help if requested
if (args.includes('--help') || args.includes('-h')) {
  console.log(`
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
`);
  process.exit(0);
}

try {
  await installUser(options);
} catch (error) {
  console.error('❌ Installation failed:', error.message);
  process.exit(1);
}

//#endregion Main

//#region Functions

function getTemplatesDir() {
  return path.join(__dirname, '..', 'templates');
}

function loadMcpServersFromTemplate(templatesDir) {
  try {
    const mcpJsonPath = path.join(templatesDir, '.mcp.json');
    const mcpConfig = JSON.parse(fs.readFileSync(mcpJsonPath, 'utf8'));

    // Add metadata for servers that require environment variables
    const servers = mcpConfig.mcpServers;
    if (servers.clickup) {
      servers.clickup.requiresEnv = ['CLICKUP_API_KEY', 'CLICKUP_TEAM_ID'];
    }

    return servers;
  } catch (error) {
    console.error(
      '❌ Error loading MCP configuration from templates:',
      error.message
    );
    return {};
  }
}

function getUserClaudeDir() {
  return path.join(os.homedir(), '.claude');
}

function copyNamespaceFiles(templatesDir, claudeDir) {
  USER_CONFIG.subDirs.forEach(subDir => {
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

async function handleUserSettingsInstallation(
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

async function getExistingMcpServers(serverNames) {
  const existingServers = new Set();

  for (const serverName of serverNames) {
    try {
      // Check if server exists at any scope by trying to get its details
      await execAsync(`claude mcp get ${serverName}`);
      existingServers.add(serverName);
      // eslint-disable-next-line no-unused-vars
    } catch (error) {
      // Server doesn't exist if 'claude mcp get' fails
      // This is expected for servers that haven't been configured
    }
  }

  return existingServers;
}

function checkEnvironmentVariables(requiredVars) {
  const missing = [];
  for (const varName of requiredVars) {
    if (!process.env[varName]) {
      missing.push(varName);
    }
  }
  return missing;
}

async function configureMcpServers(templatesDir, options = {}) {
  if (options.skipMcp) {
    console.log('🔧 Skipping MCP configuration (--skip-mcp)');
    return;
  }

  console.log('🔧 Checking MCP server configuration...');

  const mcpServers = loadMcpServersFromTemplate(templatesDir);
  if (Object.keys(mcpServers).length === 0) {
    console.log('⚠️  No MCP servers found in templates');
    return;
  }

  const hexiumServers = Object.keys(mcpServers);
  const existingServers = await getExistingMcpServers(hexiumServers);
  const serversToInstall = options.forceMcp
    ? hexiumServers
    : hexiumServers.filter(name => !existingServers.has(name));

  if (existingServers.size > 0) {
    console.log(
      `ℹ️  Found ${existingServers.size} existing MCP server(s): ${Array.from(existingServers).join(', ')}`
    );
  }

  if (serversToInstall.length === 0 && !options.forceMcp) {
    console.log('✅ All Hexium MCP servers are already configured!');
    return;
  }

  console.log(
    `📦 Available Hexium MCP servers to install: ${serversToInstall.join(', ')}`
  );

  // Check environment variables for ClickUp if it's in the list
  let clickupEnvWarning = '';
  if (serversToInstall.includes('clickup') && mcpServers.clickup?.requiresEnv) {
    const missing = checkEnvironmentVariables(mcpServers.clickup.requiresEnv);
    if (missing.length > 0) {
      clickupEnvWarning = `⚠️  ClickUp requires environment variables: ${missing.join(', ')}`;
    }
  }

  // Interactive selection unless force mode
  let selectedServers = serversToInstall;
  if (!options.force && !options.mcpOnly && !options.forceMcp) {
    const choices = serversToInstall.map(name => ({
      name: `${name}${name === 'clickup' && clickupEnvWarning ? ' (needs env setup)' : ''}`,
      value: name,
      checked: true, // Pre-select all new servers
    }));

    if (clickupEnvWarning) {
      console.log(`\n${clickupEnvWarning}`);
      console.log(
        '💡 You can set these in your shell profile (~/.zshrc, ~/.bashrc)'
      );
    }

    const answers = await inquirer.prompt([
      {
        type: 'checkbox',
        name: 'servers',
        message: 'Select MCP servers to install:',
        choices,
        pageSize: 10,
      },
    ]);

    selectedServers = answers.servers;
  }

  if (selectedServers.length === 0) {
    console.log('ℹ️  No MCP servers selected for installation');
    return;
  }

  // Install selected servers
  for (const serverName of selectedServers) {
    const config = mcpServers[serverName];
    console.log(`🔧 Installing MCP server: ${serverName}...`);

    try {
      // In force mode, remove existing server first
      if (options.forceMcp && existingServers.has(serverName)) {
        console.log(`🗑️  Removing existing ${serverName} server...`);

        // Try to remove from both scopes to ensure clean slate
        let removedFromUser = false;
        let removedFromProject = false;

        try {
          await execAsync(`claude mcp remove ${serverName} --scope user`);
          removedFromUser = true;
        } catch {
          // User scope removal failed, that's ok
        }

        try {
          await execAsync(`claude mcp remove ${serverName} --scope project`);
          removedFromProject = true;
        } catch {
          // Project scope removal failed, that's ok
        }

        if (!removedFromUser && !removedFromProject) {
          console.log(`⚠️  Could not remove ${serverName} from either scope`);
        }
      }

      let command;

      if (config.type === 'stdio') {
        command = `claude mcp add --scope user ${serverName}`;
        if (config.env) {
          for (const [key, value] of Object.entries(config.env)) {
            command += ` --env ${key}=${value}`;
          }
        }
        command += ` -- ${config.command}`;
        if (config.args && config.args.length > 0) {
          command += ` ${config.args.join(' ')}`;
        }
      } else if (config.type === 'sse') {
        command = `claude mcp add --scope user --transport sse ${serverName} "${config.url}"`;
      }

      await execAsync(command);
      console.log(`✅ ${serverName} installed successfully`);
    } catch (error) {
      console.error(`❌ Failed to install ${serverName}: ${error.message}`);
    }
  }

  if (selectedServers.includes('clickup') && clickupEnvWarning) {
    console.log("\n💡 Don't forget to set your ClickUp environment variables:");
    console.log('   export CLICKUP_API_KEY="your_api_key"');
    console.log('   export CLICKUP_TEAM_ID="your_team_id"');
  }
}

async function installUser(options = {}) {
  console.log('🌍 Installing Claude Code toolkit for user...');

  const templatesDir = getTemplatesDir();
  const claudeDir = getUserClaudeDir();

  if (options.mcpOnly) {
    // MCP-only mode: skip settings and templates
    console.log('🔧 MCP-only mode: configuring MCP servers only');
    await configureMcpServers(templatesDir, options);
    return;
  }

  // Create ~/.claude directory
  const created = createDirectory(claudeDir);
  if (created) {
    console.log('📁 ~/.claude directory created');
  }

  await handleUserSettingsInstallation(templatesDir, claudeDir, options);

  copyNamespaceFiles(templatesDir, claudeDir);

  await configureMcpServers(templatesDir, options);

  console.log('✅ User installation completed!');
  console.log('💡 User Hexium templates installed in ~/.claude/');
}

//#endregion Functions
