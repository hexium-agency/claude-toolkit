import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';
import inquirer from 'inquirer';

const execAsync = promisify(exec);

/**
 * Load MCP servers configuration from template
 * @param {string} templatesDir - Path to templates directory
 * @returns {object} MCP servers configuration
 */
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

/**
 * Get list of existing MCP servers
 * @param {string[]} serverNames - Server names to check
 * @returns {Promise<Set<string>>} Set of existing server names
 */
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

/**
 * Check if required environment variables are set
 * @param {string[]} requiredVars - List of required environment variable names
 * @returns {string[]} List of missing environment variables
 */
function checkEnvironmentVariables(requiredVars) {
  const missing = [];
  for (const varName of requiredVars) {
    if (!process.env[varName]) {
      missing.push(varName);
    }
  }
  return missing;
}

/**
 * Install a single MCP server
 * @param {string} serverName - Name of the server to install
 * @param {object} config - Server configuration
 * @param {object} options - Installation options
 * @param {Set<string>} existingServers - Set of existing servers
 * @param {string} scope - Scope for installation ('user' or 'project')
 */
async function installMcpServer(
  serverName,
  config,
  options,
  existingServers,
  scope = 'user'
) {
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
      command =
        scope === 'user'
          ? `claude mcp add --scope user ${serverName}`
          : `claude mcp add ${serverName}`;
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
      command =
        scope === 'user'
          ? `claude mcp add --scope user --transport sse ${serverName} "${config.url}"`
          : `claude mcp add --transport sse ${serverName} "${config.url}"`;
    } else {
      command =
        scope === 'user'
          ? `claude mcp add --scope user ${serverName} "${config.url}"`
          : `claude mcp add ${serverName} "${config.url}"`;
    }

    await execAsync(command);
    console.log(`✅ ${serverName} installed successfully`);
  } catch (error) {
    console.error(`❌ Failed to install ${serverName}: ${error.message}`);
  }
}

/**
 * Configure MCP servers based on template configuration
 * @param {string} templatesDir - Path to templates directory
 * @param {object} options - Installation options
 * @param {string} scope - Scope for installation ('user' or 'project')
 */
export async function configureMcpServers(
  templatesDir,
  options = {},
  scope = 'user'
) {
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
    await installMcpServer(serverName, config, options, existingServers, scope);
  }

  if (selectedServers.includes('clickup') && clickupEnvWarning) {
    console.log("\n💡 Don't forget to set your ClickUp environment variables:");
    console.log('   export CLICKUP_API_KEY="your_api_key"');
    console.log('   export CLICKUP_TEAM_ID="your_team_id"');
  }
}

/**
 * Configure MCP servers for project scope (without --scope user flag)
 * @param {string} templatesDir - Path to templates directory
 * @param {object} options - Installation options
 */
export async function configureProjectMcpServers(templatesDir, options = {}) {
  return configureMcpServers(templatesDir, options, 'project');
}
