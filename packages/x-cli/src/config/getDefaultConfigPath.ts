import path from "path";
import os from "os";

export const getDefaultConfigPath = () => path.join(os.homedir(), ".xrc.json");
