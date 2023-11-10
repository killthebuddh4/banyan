export const spec = {
  name: "deleteChannel",
  description: "Delete a chat channel.",
  parameters: {
    type: "object",
    properties: {
      channelAddress: { type: "string" },
    },
    required: ["channelAddress"],
  },
};
