import { createChannel as storeCreateChannel } from "../../channel/store/createChannel.js";
import { init } from "../../channel/init.js";

export const createChannel = async ({
  ownerAddress,
  name,
  description,
}: {
  ownerAddress: string;
  name: string;
  description: string;
}) => {
  const channel = await init({ ownerAddress, name, description });
  storeCreateChannel({ channel });
  return {
    ok: true,
    result: {
      createdChannelAddress: channel.address,
    },
  };
};
