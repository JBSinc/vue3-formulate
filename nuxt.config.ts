import type { NuxtConfig } from "nuxt/schema";
import path from "path";

const createNuxtConfig = (): NuxtConfig => {
  return {
    rootDir: path.resolve(__dirname, "examples"),
    dev: true,
    typescript: {
      typeCheck: true,
    },
    modules: ["@nuxt/eslint"],
    eslint: {
      config: {
        standalone: true,
      },
    },
  };
};

export default defineNuxtConfig(createNuxtConfig());
