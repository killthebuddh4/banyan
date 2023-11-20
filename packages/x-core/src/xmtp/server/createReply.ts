export const createReply = ({
  toRequestId,
  withContent,
}: {
  toRequestId: string;
  withContent: unknown;
}) => {
  return JSON.stringify({
    requestId: toRequestId,
    content: withContent,
  });
};
