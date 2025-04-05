import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import Conf from 'conf';
import { API_URL } from '../constantz.js';

// Load environment variables
dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, '../resources');


export const getConfig = (key) => config.get(key);
export const setConfig = (key, value) => config.set(key, value);
export const getApiUrl = () => API_URL
// export const getApiUrl = () => process.env.API_URL || config.get('API_URL');
export const getAuthToken = () => process.env.AUTH_TOKEN;
export const getRootDir = () => rootDir;

// Create configuration store
const config = new Conf({
  projectName: 'clspls',
  defaults: {
    apiUrl: getApiUrl(),
    defaultDirectory: process.env.DEFAULT_DIRECTORY || '.',
  }
});