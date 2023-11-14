import { signatureSchema } from "../actions/signatureSchema.js";

type MaybeFunctionCallResponse = {
  choices: Array<{
    message: {
      content: string | null | undefined;
      function_call?: unknown;
    };
  }>;
};

export const getFunctionCallFromResponse = ({
  response,
}: {
  response: MaybeFunctionCallResponse;
}) => {
  return signatureSchema.parse(response.choices[0].message.function_call);
};
