import { v4 as uuidV4 } from "uuid";
import { axiosInstance } from "./axiosInstance.js";

const prepareData = (name, testId) => {
  return {
    id: uuidV4(),
    sectionMarks: 0,
    sectionInstructions: "",
    name,
    order: 1,
    questions: [],
    sectionHours: 0,
    sectionMinutes: 0,
    translations: {
      Gujarati: { name, sectionInstructionsTranslation: "" },
    },
    testId,
    sectionDuration: 0,
  };
};

export const createSection = async (testId) => {
  const data = prepareData("Section A", testId);
  return axiosInstance.post("v2/test/section/create", data);
};
