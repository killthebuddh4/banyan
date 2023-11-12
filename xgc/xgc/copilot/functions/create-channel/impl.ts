import { createChannel } from "../../../channel/createChannel.js";
import { init } from "../../../channel/init.js";

export const impl = async ({
  ownerAddress,
  name,
  description,
}: {
  ownerAddress: string;
  name: string;
  description: string;
}) => {
  const channel = await init({ ownerAddress, name, description });
  createChannel({ channel });
  return {
    ok: true,
    result: {
      createdChannelAddress: channel.address,
    },
  };
};
