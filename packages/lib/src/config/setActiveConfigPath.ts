import { store } from "./store.js";
import { parseConfigPath } from "./parseConfigPath.js";

export const setActiveConfigPath = ({
  activeConfigPath,
}: {
  activeConfigPath: string | null;
}) => {
  if (activeConfigPath === null) {
    store.activeConfigPath = null;
  } else {
    store.activeConfigPath = parseConfigPath({
      rawPath: activeConfigPath,
    });
  }
};
