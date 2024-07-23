// .eslintrc.cjs

/* eslint-env node */
module.exports = {
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:playwright/playwright-test",
    "prettier",
  ],
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint"],
  root: true,
  parserOptions: {
    project: true,
    tsconfigRootDir: __dirname,
  },
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
};
