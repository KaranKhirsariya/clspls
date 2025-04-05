#!/usr/bin/env node

import { program } from "commander";
import { registerCommands } from "./commands/index.js";
import { handleExit } from "./utils/exitHandlers.js";

// Initialize CLI
program.version("1.0.0").description("Classplus (unofficial) tutor CLI");

// Register all commands
registerCommands(program);

// Parse arguments
program.parse(process.argv);

// Handle process exits
handleExit();