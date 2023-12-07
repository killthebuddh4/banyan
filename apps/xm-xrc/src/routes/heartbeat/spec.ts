export const spec = {
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
