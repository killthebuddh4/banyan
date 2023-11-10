import { DescriptiveError } from "../../../lib/DescriptiveError.js";
import { createChannel } from "../../../channel/store/createChannel.js";
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
  return channel;
};
