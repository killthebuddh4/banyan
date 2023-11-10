import { z } from "zod";
import { ChatCompletionMessageParam } from "openai/resources/index.mjs";
import { SYSTEM_MESSAGE_TEXT } from "./SYSTEM_MESSAGE_TEXT.js";

const systemMessageSchema = z.object({
  role: z.literal("system"),
});
export const withSystemMessage = ({
  messages,
}: {
  messages: ChatCompletionMessageParam[];
}): ChatCompletionMessageParam[] => {
  const hasSystemMessage = systemMessageSchema.safeParse(messages[0]).success;

  if (hasSystemMessage) {
    throw new Error(
      "Cannot add system message because there is already a system message",
    );
  }

  return [{ role: "system", content: SYSTEM_MESSAGE_TEXT }, ...messages];
};
