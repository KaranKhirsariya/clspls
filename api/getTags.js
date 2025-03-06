import { axiosInstance } from "./axiosInstance.js";

export const getTags = async (name) => {
  return axiosInstance.get("tags", { params: { search: name, isGlobal: false } });
};
