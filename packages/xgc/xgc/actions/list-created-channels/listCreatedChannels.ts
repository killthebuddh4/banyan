import { User } from "../../channel/User.js";
import { readChannelListByCreator } from "../../channel/store/readChannelListByCreator.js";

export const listCreatedChannels = async ({
  userDoingTheListing,
  creatorAddress,
}: {
  userDoingTheListing: User;
  creatorAddress: string;
}) => {
  const created = await readChannelListByCreator({
    userDoingTheReading: userDoingTheListing,
    creator: { address: creatorAddress },
  });
  return {
    ok: true,
    result: {
      createdChannels: created.map((c) => ({
        address: c.address,
        numMembers: c.members.length,
        numInvited: c.invitations.length,
      })),
    },
  };
};
