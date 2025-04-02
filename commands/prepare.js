import { Command } from "commander";
import fs from "fs";
import inquirer from "inquirer";
import path from "path";
import { prepareQuestions } from "../app/convertRawMcqToClassPlusMcq.js";
import { askForDirectory } from "../utils/askForDirectory.js";
import { getJsonFiles } from "../utils/getJsonFiles.js";

export const prepareCommand = new Command("prepare")
  .description("Prepare raw JSON files in ClassPlus formatted questions.")
  .option("-d, --dir <directory>", "Specify a custom raw JSON files directory")
  .action(async (cmd) => {
    let directory = cmd.dir || (await askForDirectory()); // Use flag, config, or ask user
    const directoryResolved = path.resolve(directory);
    console.log(`✅ Using directory: ${directoryResolved}`);

    const pendingDir = path.join(directoryResolved, "pending");
    if (!fs.existsSync(pendingDir)) {
      fs.mkdirSync(pendingDir, { recursive: true });
    }
    const files = getJsonFiles(directoryResolved);

    if (files.length === 0) {
      console.log("❌ No JSON files found!");
      return;
    }

    // Add a "Quit" option to the list
    files.push(new inquirer.Separator(), "❌ Quit");
    let step1Answers;
    try {
      step1Answers = await inquirer.prompt([
        {
          type: "list",
          name: "selectedFile",
          message: "Select a JSON file to process:",
          choices: files,
          loop: false,
        },
      ]);
      // If user selects "Quit", exit safely
      if (step1Answers.selectedFile === "❌ Quit") {
        console.log("👋 Exiting safely...");
        return process.exit(0);
      }
    } catch (error) {
      console.log("\n❌ Prompt interrupted. Exiting gracefully.");
      process.exit(0);
    }
    let step2Answers;
    try {
      step2Answers = await inquirer.prompt([
        {
          type: "input",
          name: "subject",
          message: "Enter the subject:",
        },
      ]);
    } catch (error) {
      console.log("\n❌ Prompt interrupted. Exiting gracefully.");
      process.exit(0);
    }

    const filePath = path.join(directoryResolved, step1Answers.selectedFile);
    console.log(filePath);
    try {
      const fileContent = fs.readFileSync(filePath, "utf-8");
      prepareQuestions(fileContent, step2Answers.subject, directoryResolved);
    } catch (error) {
      console.error(`❌ Error reading file: ${error.message}`);
      process.exit(1);
    }
  });
