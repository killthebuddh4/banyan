import { Channel } from "./Channel.js";
import { CONFIG } from "./CONFIG.js";
import { channelStore } from "./channelStore.js";
import { DescriptiveError } from "../lib/DescriptiveError.js";

const CHANNEL_ALREADY_EXISTS_DESCRIPTION = `
  Every channel address is an Ethereum address. Only one channel per address is allowed.
  We attempted to create a channel with an address that already exists.
`;

const OWNER_HAS_TOO_MANY_CHANNELS_DESCRIPTION = `
  Every channel has an owner. Every owner has a maximum number of channels they can own.
  The maximum is ${CONFIG.maxChannelsPerUser}. We attempted to create a channel for an owner
  that already owns the maximum number of channels.
`;

export const createChannel = ({ channel }: { channel: Channel }) => {
  const alreadyExists = channelStore.get(channel.address);

  if (alreadyExists !== undefined) {
    throw new DescriptiveError(
      CHANNEL_ALREADY_EXISTS_DESCRIPTION,
      `Failed to create channel ${channel.address} because it already exists`,
    );
  }

  const alreadyOwned = Array.from(channelStore.values()).filter((c) => {
    return c.owner.address === channel.owner.address;
  });

  if (alreadyOwned.length > CONFIG.maxChannelsPerUser) {
    throw new DescriptiveError(
      OWNER_HAS_TOO_MANY_CHANNELS_DESCRIPTION,
      `Failed to create channel ${channel.address} because the owner already owns the maximum number of channels`,
    );
  }

  channelStore.set(channel.address, channel);
};
