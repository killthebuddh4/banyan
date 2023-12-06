import { Options } from "./Options.js";

export const onStreamSuccess = ({ options }: { options?: Options }) => {
  if (options?.onStream?.success === undefined) {
    // do nothing
  } else {
    options.onStream.success();
  }
};
