import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "node:path";


export default defineConfig({
  plugins: [vue()],
  build: {
    target: "es2017",
    sourcemap: true,
    emptyOutDir: true,
    lib: {
      entry: path.resolve(__dirname, "./Formulate.js"),
      name: "Vue3Formulate",
      fileName: (format) => `formulate.${format}.js`,
      formats: ["es", "umd", "iife", "cjs", "system"],
    },
    rollupOptions: {
      external: ["vue"],
      output: {
        globals: {
          "is-plain-object": "isPlainObject",
          "@braid/vue-formulate-i18n": "VueFormulateI18n",
          vue: "Vue",
        },
        assetFileNames: (asset) => {
          console.info(asset.name);
          return asset.name!;
        },
        inlineDynamicImports: true,
      },
    },
  },
});
