import { Options } from "./Options.js";

export const onStreamError = ({
  options,
  err,
}: {
  options?: Options;
  err: unknown;
}) => {
  if (options?.onStream?.error === undefined) {
    // do nothing
  } else {
    options.onStream.error(err);
  }
};
