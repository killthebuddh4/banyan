import os from "os";
import path from "path";

export const parseConfigPath = ({ rawPath }: { rawPath: string }) => {
  if (rawPath.startsWith("~")) {
    return path.join(os.homedir(), rawPath.slice(1));
  } else {
    return rawPath;
  }
};
