#!/usr/bin/env node

import { program } from "commander";
import fs from "fs";
import path from "path";
import { prepareCommand } from "./commands/prepare.js";
import { uploadCommand } from "./commands/upload.js";

const { SOURCE_DIR } = await import("./constantz.js");
export const PENDING_DIR = path.join(SOURCE_DIR, "pending");
export const COMPLETED_DIR = path.join(SOURCE_DIR, "completed");

if (!fs.existsSync(PENDING_DIR)) {
  fs.mkdirSync(PENDING_DIR, { recursive: true });
}
if (!fs.existsSync(COMPLETED_DIR)) {
  fs.mkdirSync(COMPLETED_DIR, { recursive: true });
}

program.version("1.0.0").description("Classplus (unofficial) tutor CLI");

// Register commands
program.addCommand(prepareCommand);
program.addCommand(uploadCommand);

program.parse(process.argv);
