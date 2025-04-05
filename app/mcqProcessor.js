import { v4 as uuidv4 } from "uuid";
import { toSoftPascalCaseWithSpaces } from "../utils/stringUtils.js";
import { ensureDirectory, saveJSON, logFileSuccess } from "../utils/fileUtils.js";
import path from "path";

// Get common metadata for MCQ questions
const getMCQCommonMetadata = (subject) => {
  return {
    type: "multiple_choice",
    positiveMarks: 1,
    isNegativeMarkingEnabled: true,
    negativeMarks: 0.33,
    marks: {
      positive: 1,
      negative: 0.33,
      negativeUnattemptedMarks: 0.33,
    },
    tags: [
      {
        name: subject,
      },
    ],
    isPartialMarkingEnabled: false,
    negativeUnattemptedMarks: 0,
    isNegativeMarkingEnabledIfUnattempted: true,
    difficultyLevel: null,
    parentQuestionOrder: null,
    hasMultipleAnswers: false,
    isActive: true,
    isComprehension: false,
    isGlobal: false,
    isGlobalTest: false,
    isImported: false,
    isReported: false,
    isDummyQuestion: false,
    isGpscType: false,
  };
};

// Convert individual MCQ questions
function convertMCQ(input, subject) {
  let statements = "", gujaratiStatements = "", listType = "i";
  
  // Process additional information if available
  if (input.other_infor) {
    const listKey = Object.keys(input.other_infor)?.[0]?.replaceAll(
      /[\(\)\.]/g,
      ""
    );
    
    if (["1", "A", "a", "I", "i"].includes(listKey)) {
      listType = listKey;
    }

    statements = Object.values(input.other_infor)
      ?.map((info) => `<li>${info.english}</li>`)
      .join("\n");
      
    gujaratiStatements = Object.values(input.other_infor)
      ?.map((info) => `<li>${info.gujarati}</li>`)
      .join("\n");
  }
  
  // Create formatted MCQ output
  return {
    id: uuidv4(),
    name: `<p>${input.question.english}</p>${
      input.other_infor
        ? `\n<p></p>\n<ol type="${listType}">\n${statements}\n</ol>`
        : ""
    }`,
    nameText: `${input.question.english}\n\n${Object.values(input.other_infor || {})
      .map((info) => info.english)
      .join("\n")}`,
    solution: `<p>${input.options[input.correct_answer].english}</p>`,
    translations: {
      Gujarati: {
        name: `<p>${input.question.gujarati}</p>\n${
          input.other_infor
            ? `\n<p></p>\n<ol type="${listType}">\n${gujaratiStatements}\n</ol>`
            : ""
        }`,
        nameText: `${input.question.gujarati}\n\n${Object.values(
          input.other_infor || {}
        )
          .map((info) => info.gujarati)
          .join("\n")}`,
        solution: `<p>${input.options[input.correct_answer].gujarati}</p>`,
      },
    },
    tags: [
      { name: input.subject },
      { name: input.sub_topic || "Miscellaneous" },
    ],
    options: Object.keys(input.options).map((key, index) => ({
      id: uuidv4(),
      name: `<p>${input.options[key].english}</p>`,
      nameText: input.options[key].english,
      translations: {
        Gujarati: {
          name: `<p>${input.options[key].gujarati}</p>`,
          nameText: input.options[key].gujarati,
        },
      },
      order: index + 1,
      isCorrect: key === input.correct_answer,
    })),
    ...getMCQCommonMetadata(subject),
  };
}

// Process and organize questions by topics
export const prepareQuestions = async (jsonData, subject, directory) => {
  // Handle different data formats 
  const mcqs = jsonData.mcqs || jsonData;
  
  if (!mcqs || !Array.isArray(mcqs)) {
    throw new Error("Cannot prepare from JSON files without valid questions data.");
  }
  
  // Map for organizing MCQs by topic
  const mapTopicWiseMcqs = new Map();
  
  // Process each MCQ and organize by topic
  for (const mcq of mcqs) {
    mcq.sub_topic = toSoftPascalCaseWithSpaces(mcq.sub_topic || "Miscellaneous");
    
    if (mapTopicWiseMcqs.has(mcq.sub_topic)) {
      mapTopicWiseMcqs.get(mcq.sub_topic).push(convertMCQ(mcq, subject));
    } else {
      mapTopicWiseMcqs.set(mcq.sub_topic, [convertMCQ(mcq, subject)]);
    }
  }

  // Create subject directory
  const pendingDir = path.join(directory, "pending");
  const subjectDir = ensureDirectory(path.join(pendingDir, subject));
  
  // Create files for each topic
  const savePromises = [];
  for (const [subTopic, mcqs] of mapTopicWiseMcqs) {
    const targetPath = path.join(subjectDir, `${subTopic}.json`);
    
    // Add order and tags to each question
    const formattedMcqs = mcqs.map((output, index) => ({
      ...output,
      tags: [...output.tags, { name: subTopic }],
      order: index + 1,
    }));
    
    // Save the file
    saveJSON(targetPath, formattedMcqs);
    logFileSuccess("MCQ file created", targetPath);
  }
  
  return {
    success: true,
    topicsCount: mapTopicWiseMcqs.size,
    totalQuestions: mcqs.length
  };
}; 