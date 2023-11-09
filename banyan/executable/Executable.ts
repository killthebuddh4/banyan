import { z } from "zod";
import { Handler } from "../io/socket/Handler.js";
import { schema } from "../io/event/schema.js";

type S = z.infer<typeof schema>;

export type Executable = {
  trace: ({ handler }: { handler: Handler }) => void;
  link: ({ handler }: { handler: Handler }) => void;
  exec: ({ input }: { input: S }) => void;
};
