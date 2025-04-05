import { Command } from "commander";
import inquirer from "inquirer";
import path from "path";
import { prepareQuestions } from "../app/mcqProcessor.js";
import { askForDirectory } from "../utils/promptUtils.js";
import { getJsonFiles, ensureDirectory, loadJSON } from "../utils/fileUtils.js";

export const prepareCommand = new Command("prepare")
  .description("Prepare raw JSON files in ClassPlus formatted questions.")
  .option("-d, --dir <directory>", "Specify a custom raw JSON files directory")
  .action(async (cmd) => {
    try {
      // Get directory from command options or user input
      let directory = cmd.dir || (await askForDirectory());
      const directoryResolved = path.resolve(directory);
      console.log(`✅ Using directory: ${directoryResolved}`);

      // Ensure pending directory exists
      const pendingDir = ensureDirectory(path.join(directoryResolved, "pending"));
      
      // Get JSON files from directory
      const files = getJsonFiles(directoryResolved);
      if (files.length === 0) {
        console.log("❌ No JSON files found!");
        return;
      }

      // Add a "Quit" option to the list
      files.push(new inquirer.Separator(), "❌ Quit");
      
      // Prompt for file and subject
      const { selectedFile, subject } = await promptForFileAndSubject(files);
      
      // Process the selected file
      const filePath = path.join(directoryResolved, selectedFile);
      const fileContent = loadJSON(filePath);
      
      // Process questions
      await prepareQuestions(fileContent, subject, directoryResolved);
      
    } catch (error) {
      if (error.isTtyError) {
        console.log("\n❌ Prompt couldn't be rendered in current environment.");
      } else if (error.name === 'UserCancelled') {
        console.log("\n👋 Exiting safely...");
      } else {
        console.error(`\n❌ Error: ${error.message}`);
      }
      process.exit(error.name === 'UserCancelled' ? 0 : 1);
    }
  });

// Helper function to prompt for file and subject
async function promptForFileAndSubject(files) {
  try {
    const step1Answers = await inquirer.prompt([
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
      const error = new Error("User cancelled operation");
      error.name = 'UserCancelled';
      throw error;
    }
    
    const step2Answers = await inquirer.prompt([
      {
        type: "input",
        name: "subject",
        message: "Enter the subject:",
        validate: (input) => input.trim().length > 0 ? true : "Subject cannot be empty"
      },
    ]);
    
    return { 
      selectedFile: step1Answers.selectedFile, 
      subject: step2Answers.subject 
    };
    
  } catch (error) {
    // Handle interrupts by throwing a custom error
    if (!error.name === 'UserCancelled') {
      const cancelError = new Error("Prompt interrupted");
      cancelError.name = 'UserCancelled';
      throw cancelError;
    }
    throw error;
  }
}
