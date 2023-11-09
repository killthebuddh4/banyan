import { z } from "zod";
import * as Channel from "./channel.js";

const connectSchema = z.object({
  functionName: z.literal("connect"),
  args: z.object({
    channelId: z.string(),
    sourceId: z.string(),
  }),
});

export const connectHandler = ({
  channelId,
  sourceId,
}: z.infer<typeof connectSchema>["args"]) => {
  const channel = Channel.create({ id: channelId, ownerId: sourceId });
  Channel.setChannel({ channel });
  return { channel };
};

const publishSchema = z.object({
  functionName: z.literal("publish"),
  args: z.object({
    sourceId: z.string(),
    channelId: z.string(),
    message: z.string(),
  }),
});

export const publishHandler = ({
  channelId,
  sourceId,
  message,
}: z.infer<typeof publishSchema>["args"]) => {
  const channel = Channel.getChannel({ id: channelId });
  const event = Channel.createChannelEvent({
    channelId: channel.id,
    sourceId: sourceId,
    payload: message,
  });
  Channel.addEvent({ channel, event });
  return { event };
};

const subscribeSchema = z.object({
  functionName: z.literal("subscribe"),
  args: z.object({
    channelId: z.string(),
    sourceId: z.string(),
  }),
});

export const subscribeHandler = ({
  sourceId,
  channelId,
}: z.infer<typeof subscribeSchema>["args"]) => {
  const channel = Channel.getChannel({ id: channelId });
  Channel.addSubscriber({
    channel,
    subscriber: {
      id: sourceId,
      send: ({ event }: { event: Channel.ChannelEvent }) => {
        console.log("send", event);
      },
    },
  });
  return { channel };
};

const syncSchema = z.object({
  functionName: z.literal("sync"),
  args: z.object({
    channelId: z.string(),
    sourceId: z.string(),
  }),
});

export const syncHandler = ({
  sourceId,
  channelId,
}: z.infer<typeof syncSchema>["args"]) => {
  const channel = Channel.getChannel({ id: channelId });
  Channel.syncChannel({ channel, sourceId });
  return { channel };
};

const statsSchema = z.object({
  functionName: z.literal("stats"),
  args: z.object({
    channelId: z.string(),
  }),
});

export const statsHandler = ({
  channelId,
}: z.infer<typeof statsSchema>["args"]) => {
  const channel = Channel.getChannel({ id: channelId });
  const events = Channel.getEvents({ channel });
  return {
    numEvents: events.length,
    numSubscribers: channel.subscribers.length,
  };
};

export const rpcSchema = z.union([
  connectSchema,
  publishSchema,
  subscribeSchema,
  syncSchema,
  statsSchema,
]);
