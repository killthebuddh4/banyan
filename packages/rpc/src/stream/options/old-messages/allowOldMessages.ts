import { Options } from "../Options.js";

export const allowOldMessages = ({ options }: { options?: Options }) => {
  return options?.allowOldMessages === true;
};
