import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";

export default [
  { ignores: ["build/**", "node_modules/**", "coverage/**"] },
  { files: ["**/*.{js,mjs,cjs,ts}"] },
  // This is a Node/Express API, not a browser app — node globals (module,
  // process, __dirname, ...) are what's actually in scope at runtime.
  { languageOptions: { globals: globals.node } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  {
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
    },
  },
];
