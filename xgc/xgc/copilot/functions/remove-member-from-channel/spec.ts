export const spec = {
  name: "removeMemberFromChannel",
  description: "Remove a member from a chat channel.",
  parameters: {
    type: "object",
    properties: {
      memberAddress: { type: "string" },
      channelAddress: { type: "string" },
    },
    required: ["memberAddress", "channelAddress"],
  },
};
