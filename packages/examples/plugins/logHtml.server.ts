export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook("app:rendered", (renderContext) => {
    // const html = renderContext.renderResult?.html;
    // console.log(
    //   "-------------------------------------------------------------",
    // );
    // console.log(html);
  });
});
