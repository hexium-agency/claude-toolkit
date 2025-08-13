#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

// Config variables
const claudeFiles = [{ src: "settings.json", dest: "settings.json" }];
const rootFiles = [{ src: ".mcp.json", dest: ".mcp.json" }];
const subDirs = ["commands"];
const namespaces = ["hxm"];

console.log("🔧 Installing Claude Code toolkit...");

const projectRoot = findProjectRoot();
const claudeDir = path.join(projectRoot, ".claude");
const templatesDir = path.join(__dirname, "..", "templates");

createClaudeDirectory(claudeDir);

copyRootFiles();

copyClaudeFiles();

createClaudeGitignore();

copyNamespaceFiles();

console.log("✅ Installation completed!");
console.log(`💡 Hexium templates are available in .claude/*/hxm/`);

function copyClaudeFiles() {
  claudeFiles.forEach(({ src, dest }) => {
    const srcPath = path.join(templatesDir, src);
    const destPath = path.join(claudeDir, dest);

    if (fs.existsSync(srcPath)) {
      const action = fs.existsSync(destPath) ? "Updated" : "Created";
      fs.copyFileSync(srcPath, destPath);
      console.log(`📄 ${action}: ${dest}`);
    }
  });
}

function copyNamespaceFiles() {
  subDirs.forEach((subDir) => {
    namespaces.forEach((namespace) => {
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
        fs.readdirSync(srcSubDir).forEach((file) => {
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
      const action = fs.existsSync(destPath) ? "Updated" : "Created";
      fs.copyFileSync(srcPath, destPath);
      console.log(`📄 ${action}: ${dest} (at project root)`);
    }
  });
}

function createClaudeDirectory(claudeDir) {
  if (!fs.existsSync(claudeDir)) {
    fs.mkdirSync(claudeDir, { recursive: true });
    console.log("📁 .claude directory created");
  }
}

function createClaudeGitignore() {
  const claudeGitignorePath = path.join(claudeDir, ".gitignore");
  const gitignoreContent = `# Ignore Hexium toolkit settings to prevent noise in PRs
settings.json
*/hxm/*`;

  const action = fs.existsSync(claudeGitignorePath) ? "Updated" : "Created";
  fs.writeFileSync(claudeGitignorePath, gitignoreContent);
  console.log(`📄 ${action}: .gitignore in .claude directory`);
}

function findProjectRoot() {
  let projectRoot = process.env.INIT_CWD || process.cwd();

  if (!process.env.INIT_CWD) {
    let current = __dirname;
    while (current !== "/" && !current.includes("node_modules")) {
      current = path.dirname(current);
    }

    if (current.includes("node_modules")) {
      const nodeModulesPath = current.substring(
        0,
        current.indexOf("node_modules")
      );
      projectRoot = nodeModulesPath || process.cwd();
    }
  }

  return projectRoot;
}
