import { Options } from "./Options.js";

export const onStreamBefore = ({ options }: { options?: Options }) => {
  if (options?.onStream?.before === undefined) {
    // do nothing
  } else {
    options.onStream.before();
  }
};
