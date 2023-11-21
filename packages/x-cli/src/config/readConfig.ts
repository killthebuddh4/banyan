import { readFile } from "fs/promises";
import { jsonStringSchema } from "x-core/lib/jsonStringSchema.js";
import { configSchema } from "./configSchema.js";
import { getActiveConfigPath } from "./getActiveConfigPath.js";

export const readConfig = async () => {
  const configPath = getActiveConfigPath();
  if (typeof configPath !== "string") {
    throw new Error("No active config path");
  }
  const data = await readFile(configPath, { encoding: "utf-8" });
  return jsonStringSchema.pipe(configSchema).parse(data);
};
