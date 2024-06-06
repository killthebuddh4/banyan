import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";

export default defineConfig(async () => {
  return {
    build: {
      lib: {
        entry: "src/index.ts",
        name: "Fig",
      },
      rollupOptions: {
        external: ["react", "react-dom"],
      },
      outDir: "dist",
    },
    plugins: [react(), dts({ outputDir: "dist/types" })],
  };
});
