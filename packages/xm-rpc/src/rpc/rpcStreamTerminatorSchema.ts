import { z } from "zod";

export const rpcStreamTerminatorSchema = z.object({
  done: z.literal(true),
});
