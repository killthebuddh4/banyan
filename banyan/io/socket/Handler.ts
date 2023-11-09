import { z } from "zod";
import { schema } from "../event/schema.js";

type S = z.infer<typeof schema>;

export type Handler = ({
  event,
  outbox,
}: {
  event: S;
  outbox: S[];
}) => Promise<void>;
