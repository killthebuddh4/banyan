export const spec = {
  name: "acceptChannelInvite",
  description: "Accept an invite to a chat channel.",
  parameters: {
    type: "object",
    properties: {
      channelAddress: { type: "string" },
    },
    required: ["channelAddress"],
  },
};
