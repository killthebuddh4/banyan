import { z } from "zod";
import { User } from "../../channel/User.js";
import { signatureSchema } from "../signatureSchema.js";
import { zodToJsonSchema } from "zod-to-json-schema";

const jsonSchema = zodToJsonSchema(signatureSchema);

const schemaSchema = z.object({
  anyOf: z.array(
    z.object({
      properties: z.object({
        name: z.object({
          const: z.string(),
        }),
      }),
    }),
  ),
});

export const listAvailableCommands = async ({
  options,
}: {
  userDoingTheListing: User;
  options?: {
    nameOnly?: boolean;
  };
}) => {
  if (options?.nameOnly) {
    return {
      ok: true,
      result: {
        availableCommands: schemaSchema
          .parse(jsonSchema)
          .anyOf.map((d) => d.properties.name.const),
      },
    };
  }
  return { ok: true, result: { availableCommands: jsonSchema } };
};
