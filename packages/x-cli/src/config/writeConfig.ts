import { z } from "zod";
import { writeFile } from "fs/promises";
import { configSchema } from "./configSchema.js";
import { getActiveConfigPath } from "./getActiveConfigPath.js";

export const writeConfig = async ({
  config,
}: {
  config: z.infer<typeof configSchema>;
}) => {
  const toPath = getActiveConfigPath();
  if (typeof toPath !== "string") {
    throw new Error("No active config path");
  }
  return writeFile(toPath, JSON.stringify(config, null, 2));
};
