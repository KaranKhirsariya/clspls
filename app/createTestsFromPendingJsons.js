import chalk from "chalk";
import fs from "fs";
import path from "path";
import { pathToFileURL } from "url";
import { createMCQs } from "../api/createMCQs.js";
import { createSection } from "../api/createSection.js";
import { createTest } from "../api/createTest.js";
import { getTags } from "../api/getTags.js";
import { updateTest } from "../api/updateTest.js";
import { SOURCE_DIR } from "../constantz.js";
import { sleepRandom } from "../utils/sleepRandom.js";
import { prepareTag } from "../utils/tagUtils.js";

function loadJSON(filePath) {
  const data = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(data);
}

export const createTestsFromPendingJsons = async (subject) => {
  const tagsRes = await getTags(subject);
  const subjectTag = prepareTag(subject, tagsRes);

  const pendingDir = path.join(SOURCE_DIR, `pending/${subject}`);
  const targetDir = path.join(SOURCE_DIR, `completed/${subject}`);
  const files = fs.readdirSync(pendingDir, { encoding: "utf-8" });
  fs.mkdirSync(targetDir, { recursive: true });
  await Promise.allSettled(
    files.map(async (file) => {
      const jsonData = loadJSON(pendingDir + "/" + file);
      const testName = file.replaceAll(".json", "");
      const topicTagRes = await getTags(testName);
      await sleepRandom(0, 15);
      const tags = [subjectTag, prepareTag(testName, topicTagRes)];
      return createTest(testName, tags, jsonData.length * 60000)
        .then(async (testResponse) => {
          const testId = testResponse.data.data.test._id;
          return updateTest(testResponse.data.data.test, tags)
            .then(async (testUpdateResponse) => {
              return createSection(testId)
                .then(async (sectionResponse) => {
                  const sectionId =
                    sectionResponse.data.data.test.sections[0]._id;
                  return createMCQs(jsonData, sectionId, { testId, tags })
                    .then((mcqsResponse) => {
                      return Promise.resolve({ file, mcqsResponse });
                    })
                    .catch((error) => {
                      return Promise.reject({
                        file,
                        error:
                          "MCQs Creation failed with error: " +
                          JSON.stringify(error),
                      });
                    });
                })
                .catch((error) => {
                  return Promise.reject({
                    file,
                    error:
                      "Section Creation failed with error: " +
                      JSON.stringify(error),
                  });
                });
            })
            .catch((error) => {
              return Promise.reject({
                file,
                error:
                  "Test Update failed with error: " + JSON.stringify(error),
              });
            });
        })
        .catch((error) => {
          return Promise.reject({
            file,
            error: "Test Creation failed with error: " + JSON.stringify(error),
          });
        });
    })
  ).then((succeededPromises) => {
    succeededPromises.forEach(({ status, ...rest }) => {
      if (status === "fulfilled") {
        const targetPath = path.join(targetDir, rest.value.file);
        fs.renameSync(pendingDir + "/" + rest.value.file, targetPath);
        // Convert the file path to a proper file URL

        const fileUrl = pathToFileURL(targetPath).href;
        console.log(
          `✅ test uploaded for  ${chalk.blue.underline(
            `\u001b]8;;${fileUrl}\u001b\\${rest.value.file}\u001b]8;;\u001b\\`
          )}`
        );
      } else {
        console.log(rest.reason);
      }
    });
  });
};
// createTestsFromPendingJsons();
