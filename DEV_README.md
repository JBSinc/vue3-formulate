# Project uses nuxt for serving examples and generating configs and types

* Run "npx nuxi prepare" anytime you change the nuxt config, add modules, add composables, plugins, etc.  This will generated updated tsconfig, imports, eslint, etc.
> the .nuxt dir is not source controlled, so must be generated from "nuxi prepare" everytime, postinstall does the first one after npm install.

