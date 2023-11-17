export const createRequest = ({
  usingRequestId,
  fromInput,
}: {
  usingRequestId: string;
  fromInput: unknown;
}) => {
  return JSON.stringify({
    requestId: usingRequestId,
    content: fromInput,
  });
};
