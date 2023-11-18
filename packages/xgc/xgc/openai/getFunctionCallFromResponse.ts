import { callSchema } from "../actions/callSchema.js";

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
  return callSchema.parse(response.choices[0].message.function_call);
};
