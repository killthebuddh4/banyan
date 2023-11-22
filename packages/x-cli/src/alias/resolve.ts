import { isSource } from "./isSource.js";
import { getSource } from "./getSource.js";

export const resolve = async ({ aliasOrSource }: { aliasOrSource: string }) => {
  if (isSource({ maybeSource: aliasOrSource })) {
    return aliasOrSource;
  } else {
    return getSource({ forAlias: aliasOrSource });
  }
};
