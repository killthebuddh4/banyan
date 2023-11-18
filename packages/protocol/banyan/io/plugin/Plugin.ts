import { z } from "zod";
import { schema } from "../event/schema.js";

export type Plugin = ({
  event,
}: {
  event: z.infer<typeof schema>;
}) => z.infer<typeof schema>;
