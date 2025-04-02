import { Command } from "commander";
import fs from "fs";
import inquirer from "inquirer";
import path from "path";
import { createTestsFromPendingJsons } from "../app/createTestsFromPendingJsons.js";
import { askForDirectory } from "../utils/askForDirectory.js";
import { getNonEmptyDirectories } from "../utils/getDirectories.js";

export const uploadCommand = new Command("upload")
  .description(
    "Create and upload tests from pending Subjects - topic-wise JSONs."
  )
  .option(
    "-d, --dir <directory>",
    "Specify the directory where subdirectory named 'pending' is present with subject wise directories of prepared JSON files"
  )
  .action(async (cmd) => {
    let directory = cmd.dir || (await askForDirectory()); // Use flag, config, or ask user
    const directoryResolved = path.resolve(directory);
    const completedDir = path.join(directoryResolved, "completed");

    if (!fs.existsSync(completedDir)) {
      fs.mkdirSync(completedDir, { recursive: true });
    }

    const baseDir = path.join(directoryResolved, "pending");
    console.log(`✅ Using directory: ${baseDir}`);
    const directories = getNonEmptyDirectories(baseDir);

    if (directories.length === 0) {
      console.log("❌ No directories waiting for upload found!");
      return;
    }
    directories.push(new inquirer.Separator(), "❌ Quit");
    let answers;
    try {
      answers = await inquirer.prompt([
        {
          type: "list",
          name: "selectedDir",
          message: "Select a directory:",
          choices: directories,
          loop: false,
        },
      ]);
      // If user selects "Quit", exit safely
      if (answers.selectedDir === "❌ Quit") {
        console.log("👋 Exiting safely...");
        return process.exit(0);
      }
    } catch (error) {
      console.log("\n❌ Prompt interrupted. Exiting gracefully.");
      process.exit(0);
    }
    createTestsFromPendingJsons(answers.selectedDir, directoryResolved);
  });
