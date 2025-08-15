import path from 'path';
import os from 'os';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Get the templates directory path
 * @returns {string} Path to templates directory
 */
export function getTemplatesDir() {
  return path.join(__dirname, '..', 'templates');
}

/**
 * Get the user's Claude directory path
 * @returns {string} Path to ~/.claude directory
 */
export function getUserClaudeDir() {
  return path.join(os.homedir(), '.claude');
}

/**
 * Get the project root directory path
 * Attempts to find the actual project root when running via npx
 * @returns {string} Path to project root directory
 */
export function getProjectRoot() {
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

/**
 * Get the target Claude directory for project installations
 * @returns {string} Path to project's .claude directory
 */
export function getTargetClaudeDir() {
  const projectRoot = getProjectRoot();
  return path.join(projectRoot, '.claude');
}
