import { useEffect, useState } from "react";
import { z } from "zod";
import { readConfig } from "xm-lib/config/readConfig.js";
import { configSchema } from "xm-lib/config/configSchema.js";

export const useConfig = () => {
  const [config, setConfig] = useState<z.infer<typeof configSchema> | null>(
    null,
  );

  useEffect(() => {
    readConfig({}).then(setConfig);
  }, []);

  return config;
};
