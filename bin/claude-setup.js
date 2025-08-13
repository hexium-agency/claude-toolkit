#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

console.log("🔧 Installing Claude Code toolkit...");

// Find the actual project root where npm was invoked
// npm sets INIT_CWD to the directory where npm was initially run
let projectRoot = process.env.INIT_CWD || process.cwd();

// If INIT_CWD is not available, try to find the project root by looking for node_modules
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

const claudeDir = path.join(projectRoot, ".claude");
const templatesDir = path.join(__dirname, "..", "templates");

const subDirs = ["commands"];
const namespaces = ["hxm"];

// Create .claude directory
if (!fs.existsSync(claudeDir)) {
  fs.mkdirSync(claudeDir, { recursive: true });
  console.log("📁 .claude directory created");
}

function copyFiles() {
  // Copy hxm-specific root files
  const hxmFiles = [{ src: "settings.json", dest: "settings.json" }];

  hxmFiles.forEach(({ src, dest }) => {
    const srcPath = path.join(templatesDir, src);
    const destPath = path.join(claudeDir, dest);

    if (fs.existsSync(srcPath)) {
      // Always overwrite config files - they come from Hexium toolkit
      const action = fs.existsSync(destPath) ? "Updated" : "Created";
      fs.copyFileSync(srcPath, destPath);
      console.log(`📄 ${action}: ${dest}`);
    }
  });

  // Create .gitignore in .claude directory
  const claudeGitignorePath = path.join(claudeDir, ".gitignore");

  const gitignoreContent = `# Ignore Hexium toolkit settings to prevent noise in PRs
settings.json
*/hxm/*`;
  const action = fs.existsSync(claudeGitignorePath) ? "Updated" : "Created";
  fs.writeFileSync(claudeGitignorePath, gitignoreContent);
  console.log(`📄 ${action}: .gitignore in .claude directory`);

  subDirs.forEach((subDir) => {
    namespaces.forEach((namespace) => {
      const srcSubDir = path.join(templatesDir, subDir);
      const destSubDirBase = path.join(claudeDir, subDir);
      const destNamespaceDir = path.join(destSubDirBase, namespace);

      // Create .claude/{subDir} if needed
      if (!fs.existsSync(destSubDirBase)) {
        fs.mkdirSync(destSubDirBase, { recursive: true });
        console.log(`📁 .claude/${subDir} directory created`);
      }

      // Create .claude/{subDir}/{namespace} if needed
      if (!fs.existsSync(destNamespaceDir)) {
        fs.mkdirSync(destNamespaceDir, { recursive: true });
        console.log(`📁 .claude/${subDir}/${namespace} directory created`);
      }

      if (fs.existsSync(srcSubDir)) {
        // Copy all files from templates/commands/ to .claude/commands/hxm/
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

function copyRecursive(src, dest, forceOverwrite = false) {
  if (fs.statSync(src).isDirectory()) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    fs.readdirSync(src).forEach((file) => {
      copyRecursive(
        path.join(src, file),
        path.join(dest, file),
        forceOverwrite
      );
    });
  } else {
    if (!fs.existsSync(dest) || forceOverwrite) {
      fs.copyFileSync(src, dest);
      const action = forceOverwrite ? "Updated" : "Copied";
      console.log(`📄 ${action}: ${path.basename(dest)}`);
    } else {
      console.log(`⏭️ Skipped (already exists): ${path.basename(dest)}`);
    }
  }
}

copyFiles();

console.log("✅ Installation completed!");
console.log(`💡 Hexium templates are available in .claude/*/hxm/`);
