import type { NuxtConfig } from "nuxt/schema";

const createNuxtConfig = (): NuxtConfig => {
  return {
    rootDir: __dirname,
    dev: true,
    typescript: {
      typeCheck: true,
    },
    modules: ["@nuxt/eslint"],
  };
};

export default defineNuxtConfig(createNuxtConfig());
