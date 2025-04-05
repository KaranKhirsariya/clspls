import axios from "axios";
import { getApiUrl, getAuthToken } from "../app/config.js";

// Create reusable axios instance
export const createAxiosInstance = () => {
  const token = getAuthToken();
  const baseURL = getApiUrl();
  
  if (!token) {
    throw new Error('Authentication token is missing. Check your .env file.');
  }
  
  if (!baseURL) {
    throw new Error('API URL is missing. Check your .env or config file.');
  }
  
  return axios.create({
    method: "post",
    maxBodyLength: Infinity,
    baseURL,
    headers: {
      accept: "application/json, text/plain, */*",
      "accept-language": "en-GB,en-US;q=0.9,en;q=0.8",
      "content-type": "application/json;charset=UTF-8",
      priority: "u=1, i",
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-site",
      "x-access-token": token,
    },
    timeout: 30000, // 30 second timeout
  });
};

// Export a singleton instance for most uses
export const axiosInstance = createAxiosInstance();

// Error handling wrapper for API calls
export const safeApiCall = async (apiFunction, ...args) => {
  try {
    return await apiFunction(...args);
  } catch (error) {
    if (error.response) {
      throw new Error(`API Error: ${error.response.status} - ${JSON.stringify(error.response.data)}`);
    } else if (error.request) {
      throw new Error(`Network Error: No response received from server`);
    } else {
      throw error;
    }
  }
};
