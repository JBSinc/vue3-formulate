<!--
Get your module up and running quickly.

Find and replace all on all files (CMD+SHIFT+F):
- Name: My Module
- Package name: my-module
- Description: My new Nuxt module
-->

# vue3-formulate Nuxt Module migration from Nuxt 2

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![License][license-src]][license-href]
[![Nuxt][nuxt-src]][nuxt-href]

This is a port of the original nuxt module from vue-formulate which only supported nuxt 2
it has been built with nuxt/kit and built as a standalone npm package that depends on vue3-formulate (also ported from vue 2 to vue 3)

- [✨ &nbsp;Release Notes](/CHANGELOG.md)
<!-- - [🏀 Online playground](https://stackblitz.com/github/your-org/my-module?file=playground%2Fapp.vue) -->
<!-- - [📖 &nbsp;Documentation](https://example.com) -->

## Features

<!-- Highlight some of the features your module provide here -->
- Standlone Nuxt Module that includes vue3-formulate instead of vue3-formulate including a "nuxt" folder.

## Quick Setup

Install the module to your Nuxt application with one command:

```bash
npx nuxi module add vue3-formulate-nuxt
```

That's it! You can now use vue3-formulate-nuxt in your Nuxt app ✨


## Contribution

<details>
  <summary>Local development</summary>
  
  ```bash
  # Install dependencies
  npm install
  
  # Build For Production
  npm run build

  # Pack npm packages for vue3-formulate and vue3-formulate-nuxt
  npm run pack

  # Publish packages to local npm repo (verdaccio)
  # .npmrc assumes verdaccio running on http://localhost:4873 and will check this repo before npmjs
  npm run publish:local

  #tests
  WIP/TODO
  
    # Run ESLint
  npm run lint
  ```
</details>


<!-- Badges -->
[npm-version-src]: https://img.shields.io/npm/v/my-module/latest.svg?style=flat&colorA=020420&colorB=00DC82
[npm-version-href]: https://npmjs.com/package/my-module

[npm-downloads-src]: https://img.shields.io/npm/dm/my-module.svg?style=flat&colorA=020420&colorB=00DC82
[npm-downloads-href]: https://npmjs.com/package/my-module

[license-src]: https://img.shields.io/npm/l/my-module.svg?style=flat&colorA=020420&colorB=00DC82
[license-href]: https://npmjs.com/package/my-module

[nuxt-src]: https://img.shields.io/badge/Nuxt-020420?logo=nuxt.js
[nuxt-href]: https://nuxt.com
