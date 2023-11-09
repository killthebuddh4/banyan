import { z } from "zod";
import { schema } from "../event/schema.js";

export type Channel = {
  create: <E extends S["event"]>({
    event,
    metadata,
    data,
  }: {
    event: E;
    metadata?: unknown;
    data: Extract<S, { event: E }>["data"];
  }) => Extract<S, { event: E }>;
};

type S = z.infer<typeof schema>;
