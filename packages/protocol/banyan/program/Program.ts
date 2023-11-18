import { z } from "zod";
import { Runtime } from "../runtime/Runtime.js";
import { Node } from "../source/Node.js";
import { schema } from "../io/event/schema.js";
import { Handler } from "../io/socket/Handler.js";

type S = z.infer<typeof schema>;

export type Program = {
  id: string;
  runtime: Runtime;
  source: Node[];
  exec: ({ input }: { input: S }) => void;
  link: () => void;
  trace: ({ handler }: { handler: Handler }) => void;
};
