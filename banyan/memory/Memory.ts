import { z } from "zod";
import { schema } from "../io/event/schema.js";

type S = z.infer<typeof schema>;

export type Memory = {
  flush: ({ channel }: { channel: string }) => S[];
  write: ({ channel, events }: { channel: string; events: S[] }) => void;
};
