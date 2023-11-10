export const spec = {
  name: "declineChannelInvite",
  description: "Decline an invite to a chat channel.",
  parameters: {
    type: "object",
    properties: {
      channelAddress: { type: "string" },
    },
    required: ["channelAddress"],
  },
};
