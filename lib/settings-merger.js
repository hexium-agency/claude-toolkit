import fs from 'fs';
import path from 'path';
import inquirer from 'inquirer';

// Detect differences between existing and toolkit settings
export function detectDifferences(existing, toolkit) {
  const differences = [];

  function compareRecursive(obj1, obj2, keyPath = '') {
    for (const key in obj2) {
      const currentPath = keyPath ? `${keyPath}.${key}` : key;

      if (!(key in obj1)) {
        // New key in toolkit
        differences.push({
          type: 'new',
          key: currentPath,
          toolkitValue: obj2[key],
          displayValue: formatValue(obj2[key]),
        });
      } else if (
        typeof obj2[key] === 'object' &&
        obj2[key] !== null &&
        !Array.isArray(obj2[key])
      ) {
        // Nested object - recurse
        if (
          typeof obj1[key] === 'object' &&
          obj1[key] !== null &&
          !Array.isArray(obj1[key])
        ) {
          compareRecursive(obj1[key], obj2[key], currentPath);
        } else {
          // Type mismatch - treat as different
          differences.push({
            type: 'different',
            key: currentPath,
            existingValue: obj1[key],
            toolkitValue: obj2[key],
            displayValue: `${formatValue(obj1[key])} → ${formatValue(obj2[key])}`,
          });
        }
      } else if (JSON.stringify(obj1[key]) !== JSON.stringify(obj2[key])) {
        // Different values
        differences.push({
          type: 'different',
          key: currentPath,
          existingValue: obj1[key],
          toolkitValue: obj2[key],
          displayValue: `${formatValue(obj1[key])} → ${formatValue(obj2[key])}`,
        });
      }
    }
  }

  compareRecursive(existing, toolkit);
  return differences;
}

// Format value for display
function formatValue(value) {
  if (value === null) return 'null';
  if (typeof value === 'string') return `"${value}"`;
  if (Array.isArray(value)) return `[${value.length} items]`;
  if (typeof value === 'object') return '{object}';
  return String(value);
}

// Create interactive prompt for differences
export async function createInteractivePrompt(differences) {
  if (differences.length === 0) {
    console.log('✅ No differences found - settings are already up to date!');
    return [];
  }

  console.log(
    `\n🔍 Found ${differences.length} difference(s) between your settings and Hexium toolkit:\n`
  );

  const choices = differences.map(diff => ({
    name: `${diff.key}: ${diff.displayValue}`,
    value: diff.key,
    checked: diff.type === 'new', // Auto-select new keys
  }));

  const answers = await inquirer.prompt([
    {
      type: 'checkbox',
      name: 'selectedChanges',
      message: 'Select settings to update from Hexium toolkit:',
      choices: choices,
      pageSize: 10,
    },
  ]);

  return answers.selectedChanges;
}

// Apply selected changes to existing settings
export function applySelectedChanges(existing, differences, selections) {
  const result = JSON.parse(JSON.stringify(existing)); // Deep clone

  for (const selection of selections) {
    const diff = differences.find(d => d.key === selection);
    if (!diff) continue;

    // Apply the change using dot notation
    setNestedValue(result, diff.key, diff.toolkitValue);
  }

  return result;
}

// Set nested value using dot notation (e.g., "statusLine.enabled")
function setNestedValue(obj, path, value) {
  const keys = path.split('.');
  let current = obj;

  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    if (
      !(key in current) ||
      typeof current[key] !== 'object' ||
      current[key] === null
    ) {
      current[key] = {};
    }
    current = current[key];
  }

  current[keys[keys.length - 1]] = value;
}

// Create backup of settings file
export function backupSettings(filePath) {
  if (!fs.existsSync(filePath)) return null;

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupPath = `${filePath}.backup.${timestamp}`;

  fs.copyFileSync(filePath, backupPath);
  console.log(`📄 Backup created: ${path.basename(backupPath)}`);

  return backupPath;
}

// Main merge workflow
export async function mergeSettings(
  existingPath,
  toolkitSettings,
  options = {}
) {
  const { force = false, dryRun = false } = options;

  // Check if existing settings file exists
  if (!fs.existsSync(existingPath)) {
    console.log('📄 No existing settings found - creating new file');
    if (!dryRun) {
      fs.writeFileSync(existingPath, JSON.stringify(toolkitSettings, null, 2));
      console.log('✅ Settings file created successfully');
    }
    return;
  }

  // Load existing settings
  let existingSettings;
  try {
    existingSettings = JSON.parse(fs.readFileSync(existingPath, 'utf8'));
  } catch (error) {
    console.error('❌ Error reading existing settings file:', error.message);
    return;
  }

  // Detect differences
  const differences = detectDifferences(existingSettings, toolkitSettings);

  if (force) {
    // Force mode - apply all changes
    if (!dryRun) {
      backupSettings(existingPath);
      fs.writeFileSync(existingPath, JSON.stringify(toolkitSettings, null, 2));
      console.log('✅ Settings forcefully updated');
    } else {
      console.log('🔍 --dry-run: Would forcefully update all settings');
    }
    return;
  }

  if (dryRun) {
    // Dry run mode - show differences only
    console.log('🔍 --dry-run: Would show the following differences:');
    differences.forEach(diff => {
      console.log(`  ${diff.key}: ${diff.displayValue}`);
    });
    return;
  }

  // Interactive mode
  const selectedChanges = await createInteractivePrompt(differences);

  if (selectedChanges.length === 0) {
    console.log('ℹ️  No changes selected - settings unchanged');
    return;
  }

  // Apply selected changes
  backupSettings(existingPath);
  const mergedSettings = applySelectedChanges(
    existingSettings,
    differences,
    selectedChanges
  );
  fs.writeFileSync(existingPath, JSON.stringify(mergedSettings, null, 2));

  console.log(
    `✅ Settings updated! Applied ${selectedChanges.length} change(s)`
  );
}
