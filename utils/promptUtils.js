import inquirer from "inquirer";
import { getConfig, setConfig } from "../app/config.js";

// Ask for directory with config persistence
export const askForDirectory = async (message = "Enter directory path:") => {
  const savedDir = getConfig("defaultDirectory");
  
  try {
    const { useDefault } = savedDir ? 
      await inquirer.prompt([
        {
          type: "confirm",
          name: "useDefault",
          message: `Use last directory (${savedDir})?`,
          default: true
        }
      ]) : { useDefault: false };
      
    if (useDefault) {
      return savedDir;
    }
    
    const { directory } = await inquirer.prompt([
      {
        type: "input",
        name: "directory",
        message,
        validate: input => input.trim() ? true : "Directory cannot be empty"
      }
    ]);
    
    // Ask to save as default
    const { saveAsDefault } = await inquirer.prompt([
      {
        type: "confirm",
        name: "saveAsDefault",
        message: "Save as default directory?",
        default: false
      }
    ]);
    
    if (saveAsDefault) {
      setConfig("defaultDirectory", directory);
    }
    
    return directory;
    
  } catch (error) {
    if (error.isTtyError) {
      console.log("Prompt couldn't be rendered in the current environment");
      return savedDir || ".";
    }
    throw error;
  }
}; 