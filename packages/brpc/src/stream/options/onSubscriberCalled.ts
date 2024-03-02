import { Subscriber } from "../subscribers/Subscriber.js";
import { Options } from "./Options.js";

export const onSubscriberCalled = ({
  options,
  subscriber,
}: {
  options?: Options;
  subscriber: Subscriber;
}) => {
  if (options?.onSubscriberCalled === undefined) {
    // do nothing
  } else {
    options.onSubscriberCalled({ subscriber });
  }
};
