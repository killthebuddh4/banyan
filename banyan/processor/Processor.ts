import { z } from "zod";
import { Channel } from "../io/channel/Channel.js";
import { schema } from "../io/event/schema.js";

type S = z.infer<typeof schema>;

export type Processor<M> = ({
  io,
  memory,
}: {
  io: Channel;
  memory: M;
}) => AsyncGenerator<S, void, void>;
