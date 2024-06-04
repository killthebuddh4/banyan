import { z } from "zod";
import { readFileSync } from "fs";

const bytes = readFileSync("config.json", "utf-8");

const json = JSON.parse(bytes);

console.log(json);

export const config = z
  .object({
    server: z.object({
      key: z.string(),
      address: z.string(),
    }),
    client: z.object({
      key: z.string(),
      address: z.string(),
    }),
  })
  .parse(json);
