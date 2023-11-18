import { z } from "zod";
import { decomposed } from "./events/decomposed.js";
import { embeddings } from "./events/embeddings.js";
import { integrated } from "./events/integrated.js";
import { messageChunk } from "./events/messageChunk.js";
import { messageHistory } from "./events/messageHistory.js";
import { messageStop } from "./events/messageStop.js";
import { nodeClose } from "./events/nodeClose.js";
import { nodeEnd } from "./events/nodeEnd.js";
import { nodeError } from "./events/nodeError.js";
import { nodeStart } from "./events/nodeStart.js";
import { empty } from "./events/empty.js";
import { recontextualize } from "./events/recontextualize.js";
import { sources } from "./events/sources.js";
import { summaries } from "./events/summaries.js";
import { stream } from "./events/stream.js";
import { userIntent } from "./events/userIntent.js";
import { userMessage } from "./events/userMessage.js";

export const schema = z.discriminatedUnion("event", [
  decomposed,
  embeddings,
  integrated,
  messageChunk,
  messageHistory,
  messageStop,
  nodeClose,
  nodeEnd,
  nodeError,
  nodeStart,
  empty,
  recontextualize,
  sources,
  summaries,
  stream,
  userIntent,
  userMessage,
]);
