#!/usr/bin/env node

import { program } from "commander";
import { prepareCommand } from "./commands/prepare.js";
import { uploadCommand } from "./commands/upload.js";


program.version("1.0.0").description("Classplus (unofficial) tutor CLI");

// Register commands
program.addCommand(prepareCommand);
program.addCommand(uploadCommand);

program.parse(process.argv);
// Handle Ctrl+C gracefully
process.on("SIGINT", () => {
  console.log("\n❌ Operation cancelled by user. Exiting...");
  process.exit(0);
});