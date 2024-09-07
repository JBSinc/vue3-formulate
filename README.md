# vue3-formulate

[Work In Progress - Alpha Release]
[Examples runs, no lint errors, nuxt module works]
[Tests not yet converted/fixed, could be bugs in some of the components]

A monorepo for the Vue 3 port of [Vue Formulate](https://vueformulate.com/), designed to work seamlessly with modern build tools like Vite and supporting multiple module formats (ESM, CommonJS, IIFE).

## Packages

This monorepo contains the following packages:

- **@vue3-formulate (formulate)**
  The core of Vue Formulate for Vue 3. A port of the original vue 2 formulate code to be compatible with the options api on Vue 3

- **@vue3-formulate/nuxt (nuxt-module)**  
  Nuxt 3 module integration. This is a rewrite of the previous nuxt module, it is 
  now it's own package and built on nuxt/kit for nuxt 3 and will have 1 to 1 versioning with vue3-formulate and will be released together
  as separate npm packages.  So if a new version of vue3-formulate releases a new version of vue3-formulate-nuxt will also release.

- **examples**  
  This is a port of the previous examples but is now a nuxt 3 project that consumes the new nuxt 3 module and vue3-formulate.
  The "Specimens" and examples are the same.

- ** cypress **
  TODO, ignore

- ** test **
  TODO, tests broken currently, will work on porting them to vitest.

## Installation

If you just need vue3-formulate for vue 3

```
npm install vue3-formulate
````

If you want vue3-formulate on nuxt you can just install the module
and add it to your nuxt.config's module section

```
npm install vue3-formulate-nuxt
```
