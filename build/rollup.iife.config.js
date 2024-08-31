import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs"; // Convert CommonJS modules to ES6
import buble from "@rollup/plugin-buble"; // Transpile/polyfill with reasonable browser support
import vue from "rollup-plugin-vue"; // Handle .vue SFC files

export default {
  input: "src/Formulate.js", // Path relative to package.json
  output: {
    name: "VueFormulate",
    exports: "default",
    format: "iife",
    globals: {
      "is-plain-object": "isPlainObject",
      "@braid/vue-formulate-i18n": "VueFormulateI18n",
    },
  },
  external: ["is-plain-object", "@braid/vue-formulate-i18n"],
  plugins: [
    resolve({
      browser: true,
      preferBuiltins: false,
    }),
    vue({
      css: true, // Dynamically inject css as a <style> tag
      compileTemplate: true, // Explicitly convert template to render function
    }),
    commonjs({
      transforms: {
        forOf: false, // Disable the transformation of `for...of` loops, throws error in new rollup
      },
    }),
    buble({
      objectAssign: "Object.assign",
      transforms: {
        forOf: false, // Disable the transformation of `for...of` loops in Buble
      },
    }),
  ],
};
