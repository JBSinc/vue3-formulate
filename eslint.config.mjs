// eslint-disable-next-line import/no-unresolved
import { createConfigForNuxt } from "@nuxt/eslint-config/flat";
import jest from "eslint-plugin-jest";
import cypress from "eslint-plugin-cypress";

const sharedRules = {
  "import/no-unresolved": "error",
  "import/named": "error",
  "import/default": "error",
  "import/namespace": "error",
  "no-sparse-arrays": "off",
};

export default createConfigForNuxt(
  {
    features: {
      tooling: true,
    },
  },
  {
    rules: {
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
    },
  },
)
  .append({
    files: ["*.js", "*.mjs", "*.ts", "*.vue", "*.jsx", "*.tsx"],
    rules: {
      ...sharedRules,
    },
  })
  .append({
    files: ["test/**/*.js"],
    plugins: {
      jest,
      cypress,
    },
    languageOptions: {
      globals: {
        ...jest.environments.globals.globals,
        ...cypress.environments.globals.globals,
      },
    },
    rules: {
      ...sharedRules,
      ...jest.configs.recommended.rules,
      "jest/no-identical-title": "off",
      "jest/valid-title": "warn",
    },
  })
  .prepend({
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
