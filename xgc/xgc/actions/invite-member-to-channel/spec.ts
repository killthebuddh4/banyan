export const spec = {
  name: "inviteMemberToChannel",
  description: "Invite a member to a chat channel.",
  parameters: {
    type: "object",
    properties: {
      memberAddress: { type: "string" },
      channelAddress: { type: "string" },
    },
    required: ["memberAddress", "channelAddress"],
  },
};
