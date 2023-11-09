import { z } from "zod";
import { schema } from "../io/event/schema.js";

type S = z.infer<typeof schema>;

export type MMap<M> = (events: S[]) => Promise<M | undefined>;
