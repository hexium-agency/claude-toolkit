import path from 'path';
import { createDirectory, copyFile, copyDirectoryFiles } from './file-utils.js';

/**
 * Copy Claude-specific files to project's .claude directory
 * @param {string} templatesDir - Source templates directory
 * @param {string} claudeDir - Target .claude directory
 * @param {object} config - Project configuration object
 */
export function copyClaudeFiles(templatesDir, claudeDir, config) {
  config.claudeFiles.forEach(({ src, dest }) => {
    const srcPath = path.join(templatesDir, src);
    const destPath = path.join(claudeDir, dest);
    copyFile(srcPath, destPath, dest);
  });
}

/**
 * Copy namespaced template files to project's .claude directory
 * @param {string} templatesDir - Source templates directory
 * @param {string} claudeDir - Target .claude directory
 * @param {object} config - Project configuration object
 */
export function copyProjectNamespaceFiles(templatesDir, claudeDir, config) {
  config.subDirs.forEach(subDir => {
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

/**
 * Copy root-level files to project root
 * @param {string} templatesDir - Source templates directory
 * @param {string} projectRoot - Target project root directory
 * @param {object} config - Project configuration object
 */
export function copyRootFiles(templatesDir, projectRoot, config) {
  config.rootFiles.forEach(({ src, dest }) => {
    const srcPath = path.join(templatesDir, src);
    const destPath = path.join(projectRoot, dest);
    copyFile(srcPath, destPath, `${dest} (at project root)`);
  });
}
