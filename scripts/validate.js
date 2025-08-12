#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

console.log("🔍 Validating toolkit...");

const templatesDir = path.join(__dirname, "..", "templates");
let errors = 0;

// Check that essential files exist
const requiredFiles = ["settings.json"];

// Check that essential files exist
requiredFiles.forEach((file) => {
  const filePath = path.join(templatesDir, file);
  if (!fs.existsSync(filePath)) {
    console.error(`❌ Missing file: ${file}`);
    errors++;
  } else {
    console.log(`✅ ${file}`);
  }
});

// Check JSON syntax for settings.json
try {
  const configPath = path.join(templatesDir, "settings.json");
  JSON.parse(fs.readFileSync(configPath, "utf8"));
  console.log("✅ settings.json is valid");
} catch (error) {
  console.error("❌ settings.json is invalid:", error.message);
  errors++;
}

if (errors > 0) {
  console.error(`❌ ${errors} error(s) found`);
  process.exit(1);
} else {
  console.log("✅ Validation successful!");
}
