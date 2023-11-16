export const makeInputString = ({
  name,
  args,
}: {
  name: string;
  args: unknown;
}) => {
  return `${name}\n${JSON.stringify(args, null, 2)}`;
};
