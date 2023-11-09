import { z } from "zod";
import { create as channelCreate } from "../io/channel/create.js";
import { Compile } from "./Compile.js";
import { Handler } from "../io/socket/Handler.js";
import { schema } from "../io/event/schema.js";

type S = z.infer<typeof schema>;

export const create: Compile = ({ memory, stdin, stdout, mmap, processor }) => {
  stdin.subscribe({
    handler: async ({ event }) => {
      memory.write({ channel: event.channel, events: [event] });

      const data = memory.flush({ channel: event.channel });

      const input = await mmap(data);

      if (input === undefined) {
        memory.write({ channel: event.channel, events: data });
        return;
      }

      // TODO - This feels very much like a monkeypatch. We should create a
      // channel and then create events from the channel, not the other way
      // around. The reason we do it this way is because there is a weird order
      // of operations going on with Program, Executable, Processor, and Socket.
      // It's not completely ironed out what components should be created when
      // and where.
      const io = channelCreate({
        channel: event.channel,
      });

      for await (const output of processor({ io, memory: input })) {
        stdout.publish({ event: output });
      }
    },
  });

  const trace = ({ handler }: { handler: Handler }) => {
    stdout.subscribe({ handler });
  };

  const link = ({ handler }: { handler: Handler }) => {
    stdout.subscribe({ handler });
  };

  const exec = ({ input }: { input: S }) => {
    stdin.publish({ event: input });
  };

  return {
    trace,
    link,
    exec,
  };
};
