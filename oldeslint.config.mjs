import withNuxt from "./.nuxt/eslint.config.mjs";
import eslintConfigPrettier from "eslint-config-prettier";
import vitest from "eslint-plugin-vitest";
import jest from 'eslint-plugin-jest';

export default withNuxt({}, [
  eslintConfigPrettier,
  vitest.configs.recommended,
  {
    files: ["**/*.test.*"],
    linterOptions: {
      reportUnusedDisableDirectives: false,
    },
    plugins: {
      vitest,
      jest,
    },
    languageOptions: {
      globals: {
        ...vitest.environments.env.globals,
      },
    },
    rules: {
      ...vitest.configs.recommended.rules, // Apply recommended Vitest rules
      "nuxt/no-cjs-in-config": "off",
      "vue/no-v-html": "off",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          vars: "all",
          args: "none",
          ignoreRestSiblings: true,
          varsIgnorePattern: "^_",
        },
      ],
      "no-unused-vars": [
        "warn",
        {
          vars: "all",
          args: "none",
          ignoreRestSiblings: true,
          varsIgnorePattern: "^_",
        },
      ],
      "vue/html-self-closing": "off",
      "vue/v-on-event-hyphenation": "off",
      "no-console": ["error", { allow: ["info", "warn", "error"] }],
      "@typescript-eslint/no-explicit-any": "off",
      "import/no-unresolved": "error",
    },
    settings: {
      "import/resolver": {
        typescript: {}, // This will use tsconfig to resolve paths
      },
    },
  },
]).prepend({
  ignores: [
    "**/dist",
    "**/node_modules",
    "**/.nuxt",
    "**/.vercel",
    "**/.netlify",
    "**/public",
    "dist/*",
    "coverage/*",
    "/.cache",
  ],
});
