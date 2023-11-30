export const spec = {
  name: "describeChannel",
  description: "Get a serialized description of a channel.",
  parameters: {
    type: "object",
    properties: {
      channelAddress: { type: "string" },
    },
    required: ["channelAddress"],
  },
};
