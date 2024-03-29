/// <reference types="vitest" />
import { defineConfig } from "vite";

export default defineConfig({
  esbuild: {
    target: "esnext",
    platform: "node",
  },
  test: {
    exclude: [
      "./client/e2e/**",
      "**/node_modules/**",
      "**/dist/**",
      "**/cypress/**",
      "**/.{idea,git,cache,output,temp}/**",
      "**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build,eslint,prettier}.config.*",
    ],
  },
});
