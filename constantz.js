import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const SOURCE_DIR_LOCATION = process.env.SOURCE_DIR;

// Define __dirname for ESM
const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);

export const SOURCE_DIR = path.join(__dirname, SOURCE_DIR_LOCATION);
