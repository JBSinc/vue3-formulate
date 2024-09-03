import path from "node:path";
import Inspect from "vite-plugin-inspect";

// https://nuxt.com/docs/api/configuration/nuxt-config
console.log("Loading Exmaples Nuxt Config: ", __dirname);
export default defineNuxtConfig({
  ssr: true,
  compatibilityDate: "2024-04-03",
  dev: true,
  debug: true,
  devtools: { enabled: true },
  sourcemap: true,
  modules: ["@nuxt/eslint", "@jbs/vue3-formulate-nuxt"],
  vite: {
    plugins: [
      Inspect({
        outputDir: ".vite-inspect", // You can customize the directory where files are written
      }),
    ],
    build: {
      sourcemap: true,
    },
  },
  alias: {
    "@jbs/vue3-formulate-nuxt": path.resolve(
      __dirname,
      "../",
      "nuxt-module",
      "src",
      "module.ts",
    ),
    "@jbs/vue3-formulate": path.resolve(__dirname, "../", "formulate"),
  },
});
