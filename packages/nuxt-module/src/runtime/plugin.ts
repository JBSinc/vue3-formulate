import { defineNuxtPlugin } from "#app";
import VueFormulate from "vue3-formulate";

export default defineNuxtPlugin((_nuxtApp) => {
  const formulate = new VueFormulate();
  if (typeof formulate.install === "function") {
    // This will call the install method and register the plugin with the app
    _nuxtApp.vueApp.use(formulate);
  } else {
    console.warn("VueFormulate does not have an install method");
  }
  return {
    provide: {
      formulate: formulate,
    },
  };
});
