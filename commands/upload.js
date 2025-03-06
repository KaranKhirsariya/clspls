import { Command } from "commander";
import inquirer from "inquirer";
import { createTestsFromPendingJsons } from "../app/createTestsFromPendingJsons.js";
import { SOURCE_DIR } from "../constantz.js";
import { getNonEmptyDirectories } from "../utils/getDirectories.js";
import path from "path";

export const uploadCommand = new Command("upload")
  .description(
    "Create and upload tests from pending Subjects - topic-wise JSONs."
  )
  .action(async () => {
    const baseDir = path.join(SOURCE_DIR, "pending");
    const directories = getNonEmptyDirectories(baseDir);

    if (directories.length === 0) {
      console.log("❌ No directories waiting for upload found!");
      return;
    }
    directories.push(new inquirer.Separator(), "❌ Quit");
    const answers = await inquirer.prompt([
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

    createTestsFromPendingJsons(answers.selectedDir);
  });
