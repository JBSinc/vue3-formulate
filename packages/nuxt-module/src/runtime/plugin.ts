import { defineNuxtPlugin } from "#app";
//no types for vue3-formulate, have not ported to TS yet, so uses "any" shim in formulateShim.d.ts
import VueFormulate from "@jbs/vue3-formulate/Formulate";

export default defineNuxtPlugin((_nuxtApp) => {
  if (typeof VueFormulate.install === "function") {
    // This will call the install method and register the plugin with the app
    _nuxtApp.vueApp.use(VueFormulate);
  } else {
    console.warn("VueFormulate does not have an install method");
  }
  return {
    provide: {
      formulate: VueFormulate,
    },
  };
});
