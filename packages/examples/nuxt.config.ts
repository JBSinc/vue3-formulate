import path from "node:path";
import Inspect from "vite-plugin-inspect";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: true,
  compatibilityDate: "2024-04-03",
  dev: true,
  debug: true,
  devtools: { enabled: true },
  sourcemap: {
    server: false,
    client: true,
  },
  modules: ["@nuxt/eslint", "vue3-formulate-nuxt"],
  vite: {
    plugins: [
      Inspect({
        outputDir: ".vite-inspect", // You can customize the directory where files are written
      }),
    ],
    build: {
      sourcemap: 'inline'
    },
    server: {
      hmr: true,
    },
  },
  alias: {
    "vue3-formulate-nuxt": path.resolve(
      __dirname,
      "../",
      "nuxt-module",
      "src",
      "module.ts",
    ),
    "vue3-formulate": path.resolve(__dirname, "../", "formulate"),
  },
});
