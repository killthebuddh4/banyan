export const createChannelSpec = {
  name: "createChannel",
  description: "Create a new chat channel.",
  parameters: {
    type: "object",
    properties: {
      name: { type: "string" },
      description: { type: "string" },
    },
    required: ["name", "description"],
  },
};

export const deleteChannelSpec = {
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

export const removeMemberFromChannelSpec = {
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

export const inviteMemberToChannelSpec = {
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

export const leaveChannelSpec = {
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

export const acceptChannelInviteSpec = {
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

export const declineChannelInviteSpec = {
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
