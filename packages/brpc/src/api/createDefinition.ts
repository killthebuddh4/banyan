import { z } from "zod";

export const createDefinition = <
  I extends z.ZodTypeAny,
  O extends z.ZodTypeAny,
>({
  inputSchema,
  outputSchema,
}: {
  inputSchema: I;
  outputSchema: O;
}) => {
  return {
    inputSchema,
    outputSchema,
  };
};
