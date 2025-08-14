import fs from 'fs';
import path from 'path';

// Create directory if it doesn't exist
export function createDirectory(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    return true;
  }
  return false;
}

// Copy a single file with action logging
export function copyFile(srcPath, destPath, fileName) {
  if (!fs.existsSync(srcPath)) {
    console.log(`⚠️  Source file not found: ${fileName}`);
    return false;
  }

  const action = fs.existsSync(destPath) ? 'Updated' : 'Created';
  fs.copyFileSync(srcPath, destPath);
  console.log(`📄 ${action}: ${fileName}`);
  return true;
}

// Copy all files from a directory to another
export function copyDirectoryFiles(srcDir, destDir, _namespace) {
  if (!fs.existsSync(srcDir)) {
    return;
  }

  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
    console.log(`📁 ${path.basename(destDir)} directory created`);
  }

  fs.readdirSync(srcDir).forEach(file => {
    const srcFile = path.join(srcDir, file);
    const destFile = path.join(destDir, file);

    if (fs.statSync(srcFile).isFile()) {
      fs.copyFileSync(srcFile, destFile);
      console.log(`📄 Updated: ${file}`);
    }
  });
}

// Update gitignore file with new entries
export function updateGitignore(projectRoot, entries) {
  const gitignorePath = path.join(projectRoot, '.gitignore');
  let existingContent = '';
  let needsUpdate = false;

  if (fs.existsSync(gitignorePath)) {
    existingContent = fs.readFileSync(gitignorePath, 'utf8');
  }

  // Check which entries need to be added
  const entriesToAdd = entries.filter(entry => {
    if (entry.startsWith('#')) {
      // Don't duplicate comment if any of our patterns exist
      return !entries
        .slice(1)
        .some(pattern => existingContent.includes(pattern));
    }
    return !existingContent.includes(entry);
  });

  if (entriesToAdd.length > 0) {
    const separator =
      existingContent && !existingContent.endsWith('\n') ? '\n' : '';
    const newContent =
      existingContent + separator + entriesToAdd.join('\n') + '\n';
    fs.writeFileSync(gitignorePath, newContent);
    needsUpdate = true;
  }

  let action;
  if (fs.existsSync(gitignorePath) && !needsUpdate) {
    action = 'Already up to date';
  } else if (existingContent) {
    action = 'Updated';
  } else {
    action = 'Created';
  }
  console.log(`📄 ${action}: .gitignore (at project root)`);
}
