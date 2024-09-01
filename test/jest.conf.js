import { resolve } from "node:path";

export const rootDir = resolve(__dirname, "../");
export const moduleFileExtensions = ["js", "json", "vue"];
export const moduleNameMapper = {
  "^@/(.*)$": "<rootDir>/src/$1",
};
export const modulePaths = ["<rootDir>"];
export const transform = {
  ".*\\.js$": "<rootDir>/node_modules/babel-jest",
  ".*\\.(vue)$": "<rootDir>/node_modules/jest-vue-preprocessor",
};
export const collectCoverageFrom = ["src/*.{js,vue}"];
export const testMatch = ["<rootDir>/test/unit/*.test.js"];
