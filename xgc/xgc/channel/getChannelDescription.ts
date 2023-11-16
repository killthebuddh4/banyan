import { Channel } from "./Channel.js";
import { channelDescriptionSchema } from "./channelDescriptionSchema.js";

export const getChannelDescription = ({ channel }: { channel: Channel }) => {
  return channelDescriptionSchema.parse(channel);
};
