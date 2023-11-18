import { z } from "zod";
import { schema } from "../event/schema.js";
import { Handler } from "./Handler.js";

type S = z.infer<typeof schema>;

export type Socket = {
  inbox: S[];
  outbox: S[];
  publish: ({ event }: { event: S }) => void;
  subscribe: ({ handler }: { handler: Handler }) => void;
  close: () => void;
};
