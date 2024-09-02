import type { NuxtConfig } from "nuxt/schema";
import path from "node:path";

const createNuxtConfig = (): NuxtConfig => {
  return {
    rootDir: path.resolve(__dirname, "examples"),
    dev: true,
    typescript: {
      typeCheck: true,
    },
    modules: ["@nuxt/eslint"],
  };
};

export default defineNuxtConfig(createNuxtConfig());
