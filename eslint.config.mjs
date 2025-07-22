import eslint from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";
// https://github.com/prettier/eslint-plugin-prettier
import prettier from "eslint-plugin-prettier/recommended";

export default defineConfig([
  eslint.configs.recommended,
  tseslint.configs.recommended,
  {
    languageOptions: {
      globals: {
        // For simplicity we allow use of all globals.
        ...globals.browser,
        ...globals.node,
      },
    },
  },
  prettier,
]);
