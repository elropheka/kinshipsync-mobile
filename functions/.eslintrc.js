module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
  },
  globals: {
    __dirname: "readonly",
    Buffer: "readonly",
  },
  extends: [
    "eslint:recommended",
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:import/typescript",
    "google",
    "plugin:@typescript-eslint/recommended",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: ["tsconfig.json", "tsconfig.dev.json"],
    sourceType: "module",
    tsconfigRootDir: __dirname,
  },
  ignorePatterns: [
    "lib/**/*", // Ignore built files.
    ".eslintrc.js", // Ignore this config file itself
    // We will control JS/TS parsing via overrides instead
  ],
  plugins: [
    "@typescript-eslint",
    "import",
  ],
  overrides: [
    {
      files: ["*.ts", "*.tsx"], // Only apply TypeScript parsing to .ts and .tsx files
      parser: "@typescript-eslint/parser",
      parserOptions: {
        project: ["./tsconfig.json"], // Adjusted path
        tsconfigRootDir: __dirname,
      },
      extends: [
        "plugin:@typescript-eslint/recommended",
        // "plugin:@typescript-eslint/recommended-requiring-type-checking", // Optional: for stricter rules
      ],
      rules: {
        "@typescript-eslint/no-explicit-any": "warn",
        "@typescript-eslint/no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }],
        // Add any other TypeScript-specific rules here
      },
    },
    {
      files: ["*.js"], // Apply to JavaScript files including .eslintrc.js
      env: {
        node: true,
      },
      globals: {
        __dirname: "readonly",
        Buffer: "readonly",
      },
    },
  ],
  rules: {
    "quotes": ["error", "double"],
    "import/no-unresolved": 0,
    "indent": ["error", 2],
    "object-curly-spacing": ["error", "always"],
    "max-len": ["error", { "code": 120 }],
    "require-jsdoc": 0, // Disable for now, can be enabled later
    "valid-jsdoc": 0, // Disable for now
    "new-cap": ["error", { "capIsNewExceptions": ["firestore.Timestamp"] }],
    "@typescript-eslint/no-explicit-any": "warn",
    "@typescript-eslint/no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }],
  },
};
