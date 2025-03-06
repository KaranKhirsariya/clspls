#!/usr/bin/env node

import { program } from "commander";
import fs from "fs";
import { prepareCommand } from "./commands/prepare.js";
import { uploadCommand } from "./commands/upload.js";
import dotenv from "dotenv";
import path from "path";
// Load environment variables from .env file
dotenv.config();

const { SOURCE_DIR } = await import("./constantz.js");
export const PENDING_DIR = path.join(SOURCE_DIR, "pending");
export const COMPLETED_DIR = path.join(SOURCE_DIR, "completed");

if (!fs.existsSync(PENDING_DIR)) {
  fs.mkdirSync(PENDING_DIR, { recursive: true });
}
if (!fs.existsSync(COMPLETED_DIR)) {
  fs.mkdirSync(COMPLETED_DIR, { recursive: true });
}

// CLI version and description
program.version("1.0.0").description("Classplus (unofficial) tutor CLI");

// Register commands
program.addCommand(prepareCommand);
program.addCommand(uploadCommand);

// Parse command-line arguments
program.parse(process.argv);
