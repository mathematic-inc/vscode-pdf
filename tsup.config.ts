import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/extension.ts"],
  format: "cjs",
  external: ["vscode"],
  outDir: "dist",
  sourcemap: true,
  target: "node20",
  loader: {
    ".html": "text",
  },
});
