import { axiosInstance } from "./axiosInstance.js";

let prepareData = (name, tags, duration = 1800000) => {
  return {
    name: name,
    hours: duration / 3600000,
    minutes: duration / 60000,
    tags,
    instructions: "",
    duration,
    shuffleQuestions: false,
    shuffleOptions: false,
    generateBatchRank: true,
    defaultFont: null,
    generateInstitutionalRank: true,
    generatePercentile: true,
    showAnswers: true,
    showQuestionWiseTime: true,
    enableLetterGrading: true,
    allowResultSharing: true,
    showQuestionTimer: true,
    calculatorType: null,
    revealCorrectAnswers: "all",
    revealAnswersTime: "now",
    isSolutionMultipleViewEnabled: true,
    isSectionSwitchingEnabled: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    grades: {
      A: { max: 100, min: 70 },
      B: { max: 69, min: 50 },
      C: { max: 49, min: 35 },
      D: { max: 34, min: 20 },
      E: { max: 19, min: 10 },
      F: { max: 9, min: 0 },
    },
  };
};

export const createTest = async (name, tags, duration) => {
  return axiosInstance.post(
    "v2/test/create",
    prepareData(name, tags, duration)
  );
};
