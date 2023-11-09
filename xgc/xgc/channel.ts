import { v4 as uuid } from "uuid";

export type ChannelEvent = {
  id: string;
  channelId: string;
  sourceId: string;
  timestamp: number;
  payload: string;
};

export const createChannelEvent = ({
  channelId,
  sourceId,
  payload,
}: {
  channelId: string;
  sourceId: string;
  payload: string;
}): ChannelEvent => {
  return {
    id: uuid(),
    channelId,
    sourceId,
    timestamp: Date.now(),
    payload,
  };
};

export const serializeChannelEvent = ({ event }: { event: ChannelEvent }) => {
  return JSON.stringify(event);
};

export type Channel = {
  id: string;
  ownerId: string;
  createdAt: number;
  events: ChannelEvent[];
  subscribers: Array<{
    id: string;
    send: ({ event }: { event: ChannelEvent }) => void;
  }>;
};

export const store = new Map<string, Channel>();

export const serializeChannel = ({ channel }: { channel: Channel }) => {
  return JSON.stringify({
    id: channel.id,
  });
};

export const getChannel = ({ id }: { id: string }) => {
  const channel = store.get(id);

  if (!channel) {
    throw new Error(`channel ${id} not found`);
  }

  return channel;
};

export const setChannel = ({ channel }: { channel: Channel }) => {
  store.set(channel.id, channel);
};

export const create = ({
  id,
  ownerId,
}: {
  id: string;
  ownerId: string;
}): Channel => {
  return { id, ownerId, createdAt: Date.now(), events: [], subscribers: [] };
};

export const addEvent = ({
  channel,
  event,
}: {
  channel: Channel;
  event: ChannelEvent;
}) => {
  if (event.channelId !== channel.id) {
    throw new Error("event channelId does not match channel id");
  }

  channel.events.push(event);

  for (const subscriber of channel.subscribers) {
    subscriber.send({ event });
  }
};

export const syncChannel = ({
  channel,
  sourceId,
}: {
  channel: Channel;
  sourceId: string;
}) => {
  for (const subscriber of channel.subscribers) {
    if (subscriber.id === sourceId) {
      for (const event of channel.events) {
        subscriber.send({ event });
      }
    }
  }
};

export const broadcastChannel = ({ channel }: { channel: Channel }) => {
  for (const subscriber of channel.subscribers) {
    for (const event of channel.events) {
      subscriber.send({ event });
    }
  }
};

export const addSubscriber = ({
  channel,
  subscriber,
}: {
  channel: Channel;
  subscriber: {
    id: string;
    send: ({ event }: { event: ChannelEvent }) => void;
  };
}) => {
  channel.subscribers.push(subscriber);
};

export const getEvents = ({ channel }: { channel: Channel }) => {
  return channel.events;
};
