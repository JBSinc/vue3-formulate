import { defineNuxtModule, createResolver, updateRuntimeConfig, addPlugin } from '@nuxt/kit';
import path from 'node:path';
import fs from 'node:fs';



// -- Unbuild CommonJS Shims --
import __cjs_url__ from 'url';
import __cjs_path__ from 'path';
import __cjs_mod__ from 'module';
const __filename = __cjs_url__.fileURLToPath(import.meta.url);
const __dirname = __cjs_path__.dirname(__filename);
const require = __cjs_mod__.createRequire(import.meta.url);
const module = defineNuxtModule({
  meta: {
    name: "vue3-formulate",
    configKey: "formulate"
  },
  setup(_options, _nuxt) {
    const resolver = createResolver(import.meta.url);
    let configPath = void 0;
    if (_options.configPath) {
      configPath = resolver.resolve(_options.configPath);
      if (!fs.existsSync(configPath)) {
        configPath = path.resolve(__dirname, "formulate.config.js");
        if (!fs.existsSync(configPath)) {
          configPath = void 0;
        }
      }
    }
    updateRuntimeConfig({
      formulate: {
        configPath
      }
    });
    const pluginJs = resolver.resolve("./runtime/plugin.js");
    let pluginExtension = "js";
    if (!fs.existsSync(pluginJs)) {
      pluginExtension = "ts";
    }
    addPlugin({
      src: resolver.resolve(`./runtime/plugin.${pluginExtension}`),
      name: "formulatePlugin",
      mode: "all"
    });
  }
});

export { module as default };
