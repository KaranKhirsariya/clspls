import fs from "fs";

export const getJsonFiles = (source) => {
  if (!fs.existsSync(source)) {
    console.error(`❌ Error: Directory "${source}" not found.`);
    process.exit(1);
  }

  const files = fs.readdirSync(source).filter((file) => file.endsWith(".json"));

  if (files.length === 0) {
    console.error(`⚠️ No JSON files found in "${source}".`);
    process.exit(1);
  }

  return files;
};
