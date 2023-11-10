import { User, Channel } from "./types.js";

const CONFIG = {
  maxChannelsPerUser: 50,
};

const store = new Map<string, Channel>();

export const readChannel = ({ channelAddress }: { channelAddress: string }) => {
  return store.get(channelAddress);
};

export const writeChannel = ({ channel }: { channel: Channel }) => {
  const alreadyExists = store.get(channel.address);

  if (alreadyExists !== undefined) {
    throw new Error(`channel ${channel.address} already exists`);
  }

  const alreadyOwned = Array.from(store.values()).filter((c) => {
    return c.owner.address === channel.owner.address;
  });

  if (alreadyOwned.length > CONFIG.maxChannelsPerUser) {
    throw new Error(`user ${channel.owner.address} already owns a channel`);
  }

  store.set(channel.address, channel);
};

export const updateChannelAddUser = ({
  user,
  channelAddress,
}: {
  user: User;
  channelAddress: string;
}) => {
  const channel = store.get(channelAddress);

  if (!channel) {
    throw new Error(`channel ${channelAddress} not found`);
  }

  const alreadyMember = channel.members.find((m) => {
    return m.address === user.address;
  });

  if (alreadyMember !== undefined) {
    throw new Error(`user ${user.address} already a member of channel`);
  }

  channel.members.push(user);
};

export const updateChannelRemoveUser = ({
  user,
  channelAddress,
}: {
  user: User;
  channelAddress: string;
}) => {
  const channel = store.get(channelAddress);

  if (!channel) {
    throw new Error(`channel ${channelAddress} not found`);
  }

  const memberIndex = channel.members.findIndex((m) => {
    return m.address === user.address;
  });

  if (memberIndex === -1) {
    throw new Error(`user ${user.address} not a member of channel`);
  }

  channel.members.splice(memberIndex, 1);
};

export const deleteChannel = ({ channel }: { channel: Channel }) => {
  channel.stream.return(null);
  store.delete(channel.address);
};
