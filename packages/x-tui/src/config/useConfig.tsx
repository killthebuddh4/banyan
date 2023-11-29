import { useEffect, useState } from "react";
import { z } from "zod";
import { readConfig } from "x-core/config/readConfig.js";
import { configSchema } from "x-core/config/configSchema.js";

export const useConfig = () => {
  const [config, setConfig] = useState<z.infer<typeof configSchema> | null>(
    null,
  );

  useEffect(() => {
    readConfig({}).then(setConfig);
  }, []);

  return config;
};
