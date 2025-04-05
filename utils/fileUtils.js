import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import { pathToFileURL } from 'url';

// Centralized file operations

// Load JSON from file
export const loadJSON = (filePath) => {
  try {
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    throw new Error(`Failed to load JSON from ${filePath}: ${error.message}`);
  }
};

// Save JSON to file
export const saveJSON = (filePath, data, prettyPrint = true) => {
  try {
    const jsonString = prettyPrint ? JSON.stringify(data, null, 2) : JSON.stringify(data);
    fs.writeFileSync(filePath, jsonString, 'utf-8');
    return filePath;
  } catch (error) {
    throw new Error(`Failed to save JSON to ${filePath}: ${error.message}`);
  }
};

// Create directory if not exists
export const ensureDirectory = (dirPath) => {
  try {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
    return dirPath;
  } catch (error) {
    throw new Error(`Failed to create directory ${dirPath}: ${error.message}`);
  }
};

// Get JSON files from directory
export const getJsonFiles = (dirPath) => {
  try {
    return fs.readdirSync(dirPath)
      .filter(file => path.extname(file).toLowerCase() === '.json')
      .filter(file => fs.statSync(path.join(dirPath, file)).isFile());
  } catch (error) {
    throw new Error(`Failed to read directory ${dirPath}: ${error.message}`);
  }
};

// Get non-empty directories
export const getNonEmptyDirectories = (dirPath) => {
  try {
    return fs.readdirSync(dirPath, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name)
      .filter(dir => {
        const files = fs.readdirSync(path.join(dirPath, dir));
        return files.length > 0;
      });
  } catch (error) {
    throw new Error(`Failed to read directories from ${dirPath}: ${error.message}`);
  }
};

// Log success with clickable file link
export const logFileSuccess = (message, filePath) => {
  const fileName = path.basename(filePath);
  const fileUrl = pathToFileURL(filePath).href;
  console.log(
    `✅ ${message}: ${chalk.blue.underline(
      `\u001b]8;;${fileUrl}\u001b\\${fileName}\u001b]8;;\u001b\\`
    )}`
  );
}; 