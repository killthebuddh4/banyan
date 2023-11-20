import { User } from "../../channel/User.js";
import { updateChannelDeclineInvitation } from "../../channel/store/updateChannelDeclineInvitation.js";

export const declineChannelInvite = async ({
  userDoingTheDeclining,
  channelAddress,
}: {
  userDoingTheDeclining: User;
  channelAddress: string;
}) => {
  updateChannelDeclineInvitation({
    userDoingTheDeclining,
    channelAddress,
  });

  return {
    ok: true,
    result: {
      declinedInviteToChannelAddress: channelAddress,
    },
  };
};
