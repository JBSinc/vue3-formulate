import path from "node:path";

export default defineNuxtConfig({
  sourcemap: true,
  dev: true,
  devtools: {
    enabled: true,
  },
  debug: true,
  alias: {
    "vue3-formulate": path.resolve(__dirname, "../", "../", "formulate"),
  }
});
