import { z } from "zod";
import { schema } from "../event/schema.js";
import { Channel } from "./Channel.js";
import { v4 as uuid } from "uuid";

type S = z.infer<typeof schema>;

export const create = ({ channel }: { channel: string }): Channel => {
  const createEvent = <E extends S["event"]>({
    event,
    metadata,
    data,
  }: {
    event: E;
    metadata?: unknown;
    channel: string;
    data: Extract<S, { event: E }>["data"];
  }) => {
    return {
      id: uuid(),
      event,
      channel,
      timestamp: Date.now(),
      metadata: metadata ?? {},
      data,
    };
  };

  return {
    // TODO I for the life of me cannot get this to work without the type assertion
    create: createEvent as Channel["create"],
  };
};
