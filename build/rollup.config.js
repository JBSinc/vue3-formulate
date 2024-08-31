import commonjs from '@rollup/plugin-commonjs' // Convert CommonJS modules to ES6
import buble from '@rollup/plugin-buble' // Transpile/polyfill with reasonable browser support
import autoExternal from 'rollup-plugin-auto-external'
import vue from 'rollup-plugin-vue' // Handle .vue SFC files

export default {
  input: 'src/Formulate.js', // Path relative to package.json
  output: [
    {
      name: 'Formulate',
      exports: 'default',
      globals: {
        'is-plain-object': 'isPlainObject',
        '@braid/vue-formulate-i18n': 'VueFormulateI18n',
        'vue': 'Vue'
      },
      sourcemap: false
    }
  ],
  plugins: [    
    autoExternal(),
    vue({
      css: true, // Dynamically inject css as a <style> tag
      compileTemplate: true // Explicitly convert template to render function
    }),
    commonjs(),
    buble({
      objectAssign: 'Object.assign'
    }), // Transpile to ES5,
    //terser()
  ]
}
