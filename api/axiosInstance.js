import axios from "axios";
const token = process.env.AUTH_TOKEN;
const baseURL = process.env.API_URL;
export const axiosInstance = axios.create({
  method: "post",
  maxBodyLength: Infinity,
  baseURL: baseURL,
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
});
