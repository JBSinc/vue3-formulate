import { defineNuxtPlugin } from "#app";
import VueFormulate from "@jbs/vue3-formulate";
export default defineNuxtPlugin((_nuxtApp) => {
  console.info("Formulate plugin loaded");
  console.log(VueFormulate);
  return {
    provide: {
      formulate: VueFormulate
    }
  };
});
