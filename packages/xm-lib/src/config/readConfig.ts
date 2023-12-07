import { readFile } from "fs/promises";
import { jsonStringSchema } from "../util/jsonStringSchema.js";
import { configSchema } from "./configSchema.js";
import { getActiveConfigPath } from "./getActiveConfigPath.js";
import { getDefaultConfigPath } from "./getDefaultConfigPath.js";

export const readConfig = async ({
  overridePath,
}: {
  overridePath?: string;
}) => {
  const path = overridePath || getActiveConfigPath() || getDefaultConfigPath();
  const data = await readFile(path, { encoding: "utf-8" });
  return jsonStringSchema.pipe(configSchema).parse(data);
};
