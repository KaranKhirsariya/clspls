import { Command } from "commander";
import fs from "fs";
import inquirer from "inquirer";
import path from "path";
import { fileURLToPath } from "url";
import { prepareQuestions } from "../app/convertRawMcqToClassPlusMcq.js";
import { getJsonFiles } from "../utils/getJsonFiles.js";
import { SOURCE_DIR } from "../constantz.js";

export const prepareCommand = new Command("prepare")
  .description("Prepare raw JSON files in ClassPlus formatted questions.")
  .action(async () => {
    const files = getJsonFiles(SOURCE_DIR);

    if (files.length === 0) {
      console.log("❌ No JSON files found!");
      return;
    }

    // Add a "Quit" option to the list
    files.push(new inquirer.Separator(), "❌ Quit");

    const answers = await inquirer.prompt([
      {
        type: "list",
        name: "selectedFile",
        message: "Select a JSON file to process:",
        choices: files,
        loop: false,
      },
      {
        type: "input",
        name: "subject",
        message: "Enter the subject:",
      },
    ]);

    // If user selects "Quit", exit safely
    if (answers.selectedFile === "❌ Quit") {
      console.log("👋 Exiting safely...");
      return process.exit(0);
    }

    const filePath = path.join(SOURCE_DIR, answers.selectedFile);
    try {
      const fileContent = fs.readFileSync(filePath, "utf-8");
      prepareQuestions(fileContent, answers.subject);
    } catch (error) {
      console.error(`❌ Error reading file: ${error.message}`);
      process.exit(1);
    }
  });
