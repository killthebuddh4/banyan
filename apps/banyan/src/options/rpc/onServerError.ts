export const onServerError = ({ error }: { error: unknown }) => {
  console.error("XM-VAL-SERVER :: SERVER ERROR");
  console.error(error);
};
