import { z } from "zod";
import { schema } from "../event/schema.js";
import { Plugin } from "../plugin/Plugin.js";
import { Socket } from "./Socket.js";
import { Handler } from "./Handler.js";

type S = z.infer<typeof schema>;

type Signal = "close";

export const create = ({ plugins }: { plugins: Plugin[] }): Socket => {
  const signals: Signal[] = [];
  const inbox: S[] = [];
  const outbox: S[] = [];
  const subscriptions: Array<Handler> = [];

  const publish = ({ event }: { event: S }) => {
    const isClosed = Boolean(signals.find((signal) => signal === "close"));
    if (isClosed) {
      return;
    }

    inbox.push(event);

    const out = plugins.reduce((acc, plugin) => {
      return plugin({ event: acc });
    }, event);

    outbox.push(out);

    for (const subscription of subscriptions) {
      subscription({ event: out, outbox });
    }
  };

  const subscribe = ({ handler }: { handler: Handler }) => {
    subscriptions.push(handler);
  };

  const close = () => {
    signals.push("close");
  };

  return {
    inbox,
    outbox,
    publish,
    subscribe,
    close,
  };
};
