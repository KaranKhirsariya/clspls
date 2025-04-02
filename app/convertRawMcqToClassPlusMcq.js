import chalk from "chalk";
import fs from "fs";
import path from "path";
import { pathToFileURL } from "url";
import { v4 as uuidv4 } from "uuid";

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
function convertMCQ(input, subject) {
  let statements, gujaratiStatements, listType;
  if (input.other_infor) {
    const listKey = Object.keys(input.other_infor)?.[0]?.replaceAll(
      /[\(\)\.]/g,
      ""
    );
    if (["1", "A", "a", "I", "i"].includes(listKey)) {
      listType = listKey;
    } else {
      listType = "i";
    }

    statements = Object.values(input.other_infor)
      ?.map((info) => `<li>${info.english}</li>`)
      .join("\n");
    gujaratiStatements = Object.values(input.other_infor)
      ?.map((info) => `<li>${info.gujarati}</li>`)
      .join("\n");
  }
  const output = {
    id: uuidv4(),
    name: `<p>${input.question.english}</p>${
      input.other_infor
        ? `\n<p></p>\n<ol type="${listType}">\n${statements}\n</ol>`
        : ""
    }`,
    nameText: `${input.question.english}\n\n${Object.values(input.other_infor)
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
          input.other_infor
        )
          .map((info) => info.gujarati)
          .join("\n")}`,
        solution: `<p>${input.options[input.correct_answer].gujarati}</p>`,
      },
    },
    tags: [
      { name: input.subject },
      { name: input.sub_topic | "Miscellaneous" },
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

  return output;
}

export const prepareQuestions = (jsonFileContent, subject, directory) => {
  const jsonMCQs = JSON.parse(jsonFileContent);

  const mapTopicWiseMcqs = new Map();
  const mcqs = jsonMCQs.mcqs || jsonMCQs;
  if (!mcqs || !Array.isArray(mcqs)) {
    throw new Error("Can not prepare from json files without questions data.");
  }
  mcqs.forEach((mcq) => {
    mcq.sub_topic = mcq.sub_topic || "Miscellaneous";
    if (mapTopicWiseMcqs.has(mcq.sub_topic)) {
      mapTopicWiseMcqs.get(mcq.sub_topic).push(convertMCQ(mcq, subject));
    } else {
      mapTopicWiseMcqs.set(mcq.sub_topic, [convertMCQ(mcq, subject)]);
    }
  });

  const pendingDir = path.join(directory, "pending");

  fs.mkdirSync(`${pendingDir}/${subject}`, { recursive: true });

  mapTopicWiseMcqs.forEach(async (mcqs, subTopic) => {
    const targetPath = `${pendingDir}/${subject}/${subTopic}.json`;
    fs.writeFile(
      targetPath,
      JSON.stringify(
        mcqs.map((output, index) => ({
          ...output,
          tags: [...output.tags, { name: subTopic }],
          order: index + 1,
        })),
        null,
        "  "
      ),
      "utf-8",
      (error) => {
        if (error) throw error;
        const fileName = path.basename(targetPath);
        const fileUrl = pathToFileURL(targetPath).href;
        console.log(
          `✅ mcq file created: ${chalk.blue.underline(
            `\u001b]8;;${fileUrl}\u001b\\${fileName}\u001b]8;;\u001b\\`
          )}`
        );
      }
    );
  });
};
