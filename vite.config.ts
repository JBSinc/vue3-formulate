import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";
import autoprefixer from "autoprefixer";

export default defineConfig({
  plugins: [vue()],  
  build: {
    target: "es2017",
    cssMinify: true,
    cssCodeSplit: true,
    sourcemap: true,
    emptyOutDir: true,
    lib: {
      // Define your entry point for the library
      entry: path.resolve(__dirname, "src/Formulate.js"),
      name: "Vue3Formulate", // Name of your library
      fileName: (format) => `formulate.${format}.js`,
      formats: ["es", "umd", "iife", "cjs", "system"], // Common formats for libraries
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
          console.log(asset.name);
          return asset.name;

        },
        inlineDynamicImports: true
      },
    },
  },
  css: {    
    postcss: {
      plugins: [
        autoprefixer({
          overrideBrowserslist: "> 2%",
        })
      ],
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"), // Alias for your src directory
    },
  },
});
