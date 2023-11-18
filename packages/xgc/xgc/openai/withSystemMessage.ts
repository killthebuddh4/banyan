import { z } from "zod";
import { ChatCompletionMessageParam } from "openai/resources/index.js";
import { createSystemMessage } from "./createSystemMessage.js";

const systemMessageSchema = z.object({
  role: z.literal("system"),
});
export const withSystemMessage = ({
  userAddress,
  messages,
}: {
  userAddress: string;
  messages: ChatCompletionMessageParam[];
}): ChatCompletionMessageParam[] => {
  const hasSystemMessage = systemMessageSchema.safeParse(messages[0]).success;

  if (hasSystemMessage) {
    throw new Error(
      "Cannot add system message because there is already a system message",
    );
  }

  return [
    { role: "system", content: createSystemMessage({ userAddress }) },
    ...messages,
  ];
};
