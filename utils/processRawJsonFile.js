import fs from "fs";
import { prepareQuestions } from "../app/mcqProcessor.js";

export function processRawJsonFile(filePath, subject) {
  if (!fs.existsSync(filePath)) {
    console.error(`❌ Error: File "${filePath}" not found.`);
    process.exit(1);
  }

  try {
    const fileContent = fs.readFileSync(filePath, "utf-8");
    prepareQuestions(fileContent, subject);
  } catch (error) {
    console.error(`❌ Error reading file: ${error.message}`);
    process.exit(1);
  }
}
