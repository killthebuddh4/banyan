export const spec = {
  name: "leaveChannel",
  description: "Leave a chat channel.",
  parameters: {
    type: "object",
    properties: {
      channelAddress: { type: "string" },
    },
    required: ["channelAddress"],
  },
};
