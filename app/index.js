import { program } from "commander";
import { createTestsFromPendingJsons } from "./createTestsFromPendingJsons";

createTestsFromPendingJsons();
program
  .command("prepare")
  .description("Prepare files for upload")
  .action(() => {
    convertRaw
  });
