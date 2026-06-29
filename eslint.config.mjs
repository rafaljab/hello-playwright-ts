import js from "@eslint/js";
import tseslint from "typescript-eslint";
import playwright from "eslint-plugin-playwright";
import eslintConfigPrettier from "eslint-config-prettier";

export default tseslint.config(
  // 1. Global ignores
  {
    ignores: [
      "node_modules/",
      "results/",
      "reports/",
      ".vscode/*",
      ".DS_Store",
      "Thumbs.db",
      "**/*_spec3.json",
      "src/test-data/.storage-state/",
    ],
  },
  // 2. JavaScript recommended rules
  js.configs.recommended,
  // 3. TypeScript rules (applied only to TS files)
  {
    files: ["**/*.ts", "**/*.tsx", "**/*.mts", "**/*.cts"],
    extends: [...tseslint.configs.recommended],
    languageOptions: {
      parserOptions: {
        project: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      "@typescript-eslint/no-floating-promises": "error",
      "@typescript-eslint/await-thenable": "error",
    },
  },
  // 4. Playwright recommended rules
  {
    ...playwright.configs["flat/recommended"],
  },
  // 5. Prettier config (disables eslint rules that conflict with prettier)
  eslintConfigPrettier,
  // 6. Custom project settings and rules
  {
    rules: {
      "no-console": 0,
      "no-restricted-syntax": [
        "error",
        {
          selector: "CallExpression[callee.property.name='only']",
          message: "Do not leave .only on tests!",
        },
      ],
    },
  },
);
