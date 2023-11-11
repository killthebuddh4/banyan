import { User } from "./User.js";
import { Channel } from "./Channel.js";

export const publishToChannel = ({
  fromUser,
  channel,
  message,
}: {
  fromUser: User;
  channel: Channel;
  message: string;
}) => {
  for (const member of channel.members) {
    if (fromUser.address === member.address) {
      continue;
    } else {
      channel.client.conversations
        .newConversation(member.address)
        .then((conversation) => {
          conversation.send(`${fromUser.address}: ${message}`);
        });
    }
  }
};
