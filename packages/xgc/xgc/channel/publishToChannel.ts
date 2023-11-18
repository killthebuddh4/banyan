import { User } from "./User.js";
import { Channel } from "./Channel.js";

export const publishToChannel = async ({
  fromUser,
  channel,
  message,
}: {
  fromUser: User;
  channel: Channel;
  message: string;
}) => {
  const conversations = await Promise.all(
    channel.members.map((member) => {
      return channel.client.conversations.newConversation(member.address);
    }),
  );

  const sent = await Promise.all(
    conversations.map((conversation) => {
      return conversation.send(`${fromUser.address}: ${message}`);
    }),
  );

  return sent;
};
