import { z } from "zod";
import { schema } from "../io/event/schema.js";
import { Memory } from "./Memory.js";

type S = z.infer<typeof schema>;

export const create: () => Memory = () => {
  const memory: Record<string, S[]> = {};

  return {
    write: ({ channel, events }) => {
      const wrongChannel = events.find((e) => e.channel !== channel);

      if (wrongChannel !== undefined) {
        throw new Error("Attempted to write events to wrong memory channel!");
      }

      if (memory[channel] === undefined) {
        memory[channel] = [];
      }

      memory[channel].push(...events);
    },
    flush: ({ channel }) => {
      const data = memory[channel] ?? [];
      memory[channel] = [];
      return data;
    },
  };
};
