import { jsonStringSchema } from "x-core/lib/jsonStringSchema.js";
import { readFileSync } from "fs";

export const getArguments = ({ userInput }: { userInput: string }) => {
  const inputJson = jsonStringSchema.safeParse(userInput);

  if (!inputJson.success) {
    const data = readFileSync(userInput, "utf8");
    return jsonStringSchema.parse(data);
  } else {
    return inputJson.data;
  }
};
