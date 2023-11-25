import { Metadata } from "./Metadata.js";
import { MessageHandler } from "./MessageHandler.js";
import { Filter } from "./Filter.js";

export type Subscriber = {
  metadata: Metadata;
  filter: Filter;
  handler: MessageHandler;
};
