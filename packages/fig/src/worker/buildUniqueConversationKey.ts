export const buildUniqueConversationKey = (conversation: {
  peerAddress: string;
  context?: { conversationId?: string };
}) => {
  return `${conversation.peerAddress}-${conversation.context?.conversationId}`;
};
