import fs from 'fs';
import path from 'path';
import { createDirectory } from './file-utils.js';
import { mergeSettings } from './settings-merger.js';

/**
 * Handle user settings installation with directory creation and settings merge
 * @param {string} templatesDir - Path to templates directory
 * @param {string} claudeDir - Path to user's .claude directory
 * @param {object} options - Installation options
 */
export async function handleUserSettingsInstallation(
  templatesDir,
  claudeDir,
  options
) {
  // Create directory if needed
  if (createDirectory(claudeDir)) {
    console.log('📁 ~/.claude directory created');
  }

  // Load and merge settings
  const settingsTemplatePath = path.join(templatesDir, 'settings.json');
  const settingsTargetPath = path.join(claudeDir, 'settings.json');

  let toolkitSettings;
  try {
    toolkitSettings = JSON.parse(fs.readFileSync(settingsTemplatePath, 'utf8'));
  } catch (error) {
    console.error('❌ Error reading toolkit settings template:', error.message);
    return;
  }

  await mergeSettings(settingsTargetPath, toolkitSettings, options);
}
