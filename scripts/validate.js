#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

console.log("🔍 Validating toolkit...");

const templatesDir = path.join(__dirname, "..", "templates");
let errors = 0;

// Check that essential files exist
const requiredFiles = ["settings.json", ".mcp.json"];

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

// Check JSON syntax for JSON files
const jsonFiles = ["settings.json", ".mcp.json"];
jsonFiles.forEach((file) => {
  try {
    const filePath = path.join(templatesDir, file);
    if (fs.existsSync(filePath)) {
      JSON.parse(fs.readFileSync(filePath, "utf8"));
      console.log(`✅ ${file} is valid`);
    }
  } catch (error) {
    console.error(`❌ ${file} is invalid:`, error.message);
    errors++;
  }
});

if (errors > 0) {
  console.error(`❌ ${errors} error(s) found`);
  process.exit(1);
} else {
  console.log("✅ Validation successful!");
}
