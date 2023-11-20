import { ChatCompletionMessageParam } from "openai/resources/index.js";

export const withFunctionCall = ({
  messages,
  functionCall,
}: {
  messages: ChatCompletionMessageParam[];
  functionCall: { name: string; arguments: unknown };
}): ChatCompletionMessageParam[] => {
  if (messages.length === 0) {
    throw new Error("Cannot add function call because there are no messages");
  }

  return [
    ...messages,
    {
      role: "assistant",
      content: null,
      function_call: {
        name: functionCall.name,
        arguments: JSON.stringify(functionCall.arguments),
      },
    },
  ];
};
