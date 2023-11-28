import { createChannel as storeCreateChannel } from "../../db/store/createChannel.js";
import { init } from "../../db/init.js";
import { User } from "../../db/User.js";

export const createChannel = async ({
  userDoingTheCreating,
  name,
  description,
}: {
  userDoingTheCreating: User;
  name: string;
  description: string;
}) => {
  const channel = await init({
    ownerAddress: userDoingTheCreating.address,
    name,
    description,
  });
  storeCreateChannel({ channel });
  return {
    ok: true,
    result: {
      createdChannelAddress: channel.address,
    },
  } as const;
};
