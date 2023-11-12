import { MessageHandler } from "../../xmtp/MessageHandler.js";

export const handleSuperuserMessage: MessageHandler = async ({ messages }) => {
  console.log("handleSuperuserMessage", messages);
};
