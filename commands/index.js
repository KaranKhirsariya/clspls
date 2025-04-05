import { prepareCommand } from "./prepare.js";
import { uploadCommand } from "./upload.js";

export const registerCommands = (program) => {
  program.addCommand(prepareCommand);
  program.addCommand(uploadCommand);
  
  // Add more commands here as needed
}; 