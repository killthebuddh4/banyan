import { User } from "../../../channel/User.js";
import { updateChannelDeclineInvitation } from "../../../channel/updateChannelDeclineInvitation.js";

export const impl = async ({
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
      userDeclinedAddress: userDoingTheDeclining.address,
      channelAddress,
    },
  };
};
