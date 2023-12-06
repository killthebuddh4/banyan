import { Options } from "./Options.js";

export const onUncaughtHandlerError = ({
  options,
  err,
}: {
  options?: Options;
  err: unknown;
}) => {
  if (options?.onUncaughtHandlerError === undefined) {
    console.error(
      "Caught an uncaught handler error, but no handler was provided to handle it. You might want to",
    );
    console.error(
      "provide an `onUncaughtHandlerError` as an options to `start`.",
    );
  } else {
    options.onUncaughtHandlerError(err);
  }
};
