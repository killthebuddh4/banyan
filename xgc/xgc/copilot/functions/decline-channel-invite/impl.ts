import { Client } from "@xmtp/xmtp-js";
import { User } from "../../../channel/User.js";
import { updateChannelDeclineInvitation } from "../../../channel/updateChannelDeclineInvitation.js";

export const impl = async ({
  userDoingTheDeclining,
  channelAddress,
}: {
  userDoingTheDeclining: User;
  channelAddress: string;
}) => {
  return updateChannelDeclineInvitation({
    userDoingTheDeclining,
    channelAddress,
  });
};
