// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require("eslint-config-expo/flat");

module.exports = defineConfig([
  ...expoConfig,
  {
    ignores: ["dist/*", "node_modules/*", "functions/*"],
  },
  {
    rules: {
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }],
      "@typescript-eslint/array-type": ["error", { default: "array-simple" }],
      "no-restricted-imports": ["error", {
        paths: [
          { name: "@/constants/mock/homeDashboard", message: "Use real Firestore data (Part C)." },
          { name: "@/constants/mock", message: "Mock directory is banned." },
          { name: "@/services/axiosInstance", message: "Removed — use Firebase auth only." },
        ],
        patterns: [{ group: ["**/constants/mock/*"], message: "Mock imports banned." }],
      }],
    },
  },
]);
