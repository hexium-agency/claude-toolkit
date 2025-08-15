import path from 'path';
import { createDirectory, copyDirectoryFiles } from './file-utils.js';

/**
 * Copy namespaced template files to target directory
 * @param {string} templatesDir - Source templates directory
 * @param {string} targetDir - Target directory (e.g., ~/.claude or .claude)
 * @param {string[]} subDirs - Subdirectories to process (e.g., ['agents', 'commands'])
 */
export function copyNamespaceFiles(templatesDir, targetDir, subDirs) {
  subDirs.forEach(subDir => {
    const srcSubDir = path.join(templatesDir, subDir);
    const destSubDirBase = path.join(targetDir, subDir);
    const destNamespaceDir = path.join(destSubDirBase, 'hxm');

    // Create subdirectory if it doesn't exist
    if (createDirectory(destSubDirBase)) {
      const targetType = targetDir.includes('.claude') ? '.claude' : targetDir;
      console.log(`📁 ${targetType}/${subDir} directory created`);
    }

    // Create namespace directory if it doesn't exist
    if (createDirectory(destNamespaceDir)) {
      const targetType = targetDir.includes('.claude') ? '.claude' : targetDir;
      console.log(`📁 ${targetType}/${subDir}/hxm directory created`);
    }

    // Copy all files from template subdirectory to namespace directory
    copyDirectoryFiles(srcSubDir, destNamespaceDir, 'hxm');
  });
}
