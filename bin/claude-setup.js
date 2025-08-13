#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

// Config variables
const claudeFiles = [{ src: 'settings.json', dest: 'settings.json' }];
const rootFiles = [{ src: '.mcp.json', dest: '.mcp.json' }];
const subDirs = ['commands'];
const namespaces = ['hxm'];

console.log('🔧 Installing Claude Code toolkit...');

const projectRoot = findProjectRoot();
const claudeDir = path.join(projectRoot, '.claude');
const templatesDir = path.join(__dirname, '..', 'templates');

createClaudeDirectory(claudeDir);

copyRootFiles();

copyClaudeFiles();

updateRootGitignore();

copyNamespaceFiles();

console.log('✅ Installation completed!');
console.log(`💡 Hexium templates are available in .claude/*/hxm/`);

function copyClaudeFiles() {
  claudeFiles.forEach(({ src, dest }) => {
    const srcPath = path.join(templatesDir, src);
    const destPath = path.join(claudeDir, dest);

    if (fs.existsSync(srcPath)) {
      const action = fs.existsSync(destPath) ? 'Updated' : 'Created';
      fs.copyFileSync(srcPath, destPath);
      console.log(`📄 ${action}: ${dest}`);
    }
  });
}

function copyNamespaceFiles() {
  subDirs.forEach(subDir => {
    namespaces.forEach(namespace => {
      const srcSubDir = path.join(templatesDir, subDir);
      const destSubDirBase = path.join(claudeDir, subDir);
      const destNamespaceDir = path.join(destSubDirBase, namespace);

      if (!fs.existsSync(destSubDirBase)) {
        fs.mkdirSync(destSubDirBase, { recursive: true });
        console.log(`📁 .claude/${subDir} directory created`);
      }

      if (!fs.existsSync(destNamespaceDir)) {
        fs.mkdirSync(destNamespaceDir, { recursive: true });
        console.log(`📁 .claude/${subDir}/${namespace} directory created`);
      }

      if (fs.existsSync(srcSubDir)) {
        fs.readdirSync(srcSubDir).forEach(file => {
          const srcFile = path.join(srcSubDir, file);
          const destFile = path.join(destNamespaceDir, file);

          if (fs.statSync(srcFile).isFile()) {
            fs.copyFileSync(srcFile, destFile);
            console.log(`📄 Updated: ${file}`);
          }
        });
      }
    });
  });
}

function copyRootFiles() {
  rootFiles.forEach(({ src, dest }) => {
    const srcPath = path.join(templatesDir, src);
    const destPath = path.join(projectRoot, dest);

    if (fs.existsSync(srcPath)) {
      const action = fs.existsSync(destPath) ? 'Updated' : 'Created';
      fs.copyFileSync(srcPath, destPath);
      console.log(`📄 ${action}: ${dest} (at project root)`);
    }
  });
}

function createClaudeDirectory(claudeDir) {
  if (!fs.existsSync(claudeDir)) {
    fs.mkdirSync(claudeDir, { recursive: true });
    console.log('📁 .claude directory created');
  }
}

function updateRootGitignore() {
  const rootGitignorePath = path.join(projectRoot, '.gitignore');
  const newEntries = [
    '# Ignore Hexium toolkit settings to prevent noise in PRs',
    '.claude/settings.json',
    '.claude/*/hxm/*',
    '.mcp.json',
  ];

  let existingContent = '';
  let needsUpdate = false;

  if (fs.existsSync(rootGitignorePath)) {
    existingContent = fs.readFileSync(rootGitignorePath, 'utf8');
  }

  // Check which entries need to be added
  const entriesToAdd = newEntries.filter(entry => {
    if (entry.startsWith('#')) {
      // Don't duplicate comment if any of our patterns exist
      return !newEntries
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
    fs.writeFileSync(rootGitignorePath, newContent);
    needsUpdate = true;
  }

  let action;
  if (fs.existsSync(rootGitignorePath) && !needsUpdate) {
    action = 'Already up to date';
  } else if (existingContent) {
    action = 'Updated';
  } else {
    action = 'Created';
  }
  console.log(`📄 ${action}: .gitignore (at project root)`);
}

function findProjectRoot() {
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
