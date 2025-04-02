import fs from "fs";
import inquirer from "inquirer";
import path from "path";
import config from "../app/config.js";

export async function askForDirectory() {
  const savedDir = config.get("dir");
  let returnVal = savedDir;
  if (savedDir) {
    try {
      const { useSavedDir } = await inquirer.prompt([
        {
          type: "confirm",
          name: "useSavedDir",
          message: `Use saved directory? (${savedDir})`,
          default: true,
        },
      ]);
      if (useSavedDir) {
        returnVal = savedDir;
      }
    } catch (error) {
      console.log("\n❌ Prompt interrupted. Exiting gracefully.");
      process.exit(0);
    }
  }

  if (!returnVal) {
    // Ask user to select a new directory
    try {
      const { newDir } = await inquirer.prompt([
        {
          type: "input",
          name: "newDir",
          message:
            "Enter the directory path for raw JSON files and output directories: (Keep empty for current directory)",
          default: process.cwd(),
        },
      ]);
      config.set("dir", newDir); // Save new directory
      returnVal = newDir;
    } catch (error) {
      console.log("\n❌ Prompt interrupted. Exiting gracefully.");
      process.exit(0);
    }
  }

  return returnVal;
}
