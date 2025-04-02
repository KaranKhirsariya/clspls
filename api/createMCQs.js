import { axiosInstance } from "./axiosInstance.js";

const prepareData = (questions, testId, sectionId) => {
  return {
    testId,
    sectionId,
    questions: questions,
  };
};

export const createMCQs = async (questions, sectionId, testData) => {
  //TODO: assuming here that second tag is topic and same in all questions
  questions.forEach((element) => {
    element.tags = testData.tags;
  });
  return axiosInstance.post(
    "v2/question/create",
    prepareData(questions, testData.testId, sectionId)
  );
};
