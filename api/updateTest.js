import { axiosInstance } from "./axiosInstance.js";

const prepareData = (testRes, tags) => {
  return {
    instructions: "",
    testHours: testRes.duration / 3600000,
    testMinutes: testRes.duration / 60000,
    name: testRes.name,
    tags: tags.map(({...rest}) => ({ ...rest, isActive: true })),
    _id: testRes._id,
    // parentFolder: "67c05599491205bd1de2b955",
    totalMarks: 0,
    duration: testRes.duration,
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
    createdAt: testRes.createdAt,
    updatedAt: new Date().toISOString(),
    grades: {
      A: { max: 100, min: 70 },
      B: { max: 69, min: 50 },
      C: { max: 49, min: 35 },
      D: { max: 34, min: 20 },
      E: { max: 19, min: 10 },
      F: { max: 9, min: 0 },
    },
    generateRandomTest: false,
    hasOptionalQuestions: false,
    settingsForRTG: {},
    isTemplateSelected: true,
    testType: "TB_TEST",
    selectedLang: "Gujarati",
    translations: { Gujarati: { instructions: "" } },
  };
};
export const updateTest = (testRes, tags) => {
  return axiosInstance.patch("v2/test/update", prepareData(testRes, tags));
};
