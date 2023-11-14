import { Channel } from "./Channel.js";

export const getChannelDescription = ({ channel }: { channel: Channel }) => {
  return {
    owner: channel.owner,
    address: channel.address,
    createdAt: channel.createdAt,
    creator: channel.creator,
    name: channel.name,
    description: channel.description,
    invitations: channel.invitations,
    members: channel.members,
  };
};
