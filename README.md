# classplus-cli

this utility is for classplus users who have large amount of data.
currently this tool supports

- create classplus formatted MCQ from specific template of raw MCQ json file.
- upload tests from a topicwise jsons created for the "subject" for each "sub_topic" of mcq data.

`clspls prepare`
This command helps to prepare the raw json format to classplus formatted mcq question

here is the sample input json file:
[sampleRawMCQs.json](./sampleRawMCQs.json)

output:

```
Environment/
|
+- Ecosystems and Conservation Efforts.json
|
+- Environmental Pollution.json
```

`claspls upload`
This command uploads the prepared json as individual tests in classplus test portal.
