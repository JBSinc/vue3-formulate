import {
  defineNuxtModule,
  addPlugin,
  createResolver,
  updateRuntimeConfig,
} from "@nuxt/kit";
import path from "node:path";
import fs from "node:fs";

export interface FormulateModuleOptions {
  configPath?: string | undefined;
}

export default defineNuxtModule<FormulateModuleOptions>({
  meta: {
    name: "vue3-formulate",
    configKey: "formulate",
  },
  setup(_options, _nuxt) {
    const resolver = createResolver(import.meta.url);
    let configPath: string | undefined = undefined;

    // nuxt 3, the config root and the module options are automatically merged
    // and passed tot he module setup as one merged object
    if (_options.configPath) {
      configPath = resolver.resolve(_options.configPath);
      if (!fs.existsSync(configPath)) {
        configPath = path.resolve(__dirname, "formulate.config.js");
        if (!fs.existsSync(configPath)) {
          configPath = undefined;
        }
      }
    }

    //nuxt 3, you can't pass options to the plugin, you need to put them on the runtime config
    updateRuntimeConfig({
      formulate: {
        configPath,
      },
    });

    const pluginJs = resolver.resolve("./runtime/plugin.js");
    let pluginExtension = "js";

    if (!fs.existsSync(pluginJs)) {
      pluginExtension = "ts";
    }

    // Add the plugin (using the dynamically generated JS file)
    addPlugin({
      src: resolver.resolve(`./runtime/plugin.${pluginExtension}`),
      name: "formulatePlugin",
      mode: "all",
    });
  },
});

//nuxt 3 , strongly type the runtime config so module consumers get
//strongly typed runtime configs when they run nuxi prepare
declare module "nuxt/schema" {
  interface RuntimeConfig {
    formulate: FormulateModuleOptions;
  }
}
