// Function to get directories only
import fs from "fs";
import path from "path";

// Function to get non-empty directories
export function getNonEmptyDirectories(source) {
  return fs
    .readdirSync(source, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory() && !dirent.name.startsWith(".")) // Only get directories
    .map((dirent) => dirent.name)
    .filter((dirName) => {
      const dirPath = path.join(source, dirName);
      const files = fs.readdirSync(dirPath);
      return files.length > 0; // Filter out empty directories
    });
}
