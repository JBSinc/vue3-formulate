import * as _nuxt_schema from '@nuxt/schema';

interface FormulateModuleOptions {
    configPath?: string | undefined;
}
declare const _default: _nuxt_schema.NuxtModule<FormulateModuleOptions, FormulateModuleOptions, false>;

declare module "nuxt/schema" {
    interface RuntimeConfig {
        formulate: FormulateModuleOptions;
    }
}

export { type FormulateModuleOptions, _default as default };
