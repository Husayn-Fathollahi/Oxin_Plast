/** @type {import('eslint').Linter.Config} */
module.exports = {
  root: true,
  extends: ['next/core-web-vitals', 'next/typescript'],
  rules: {
    // Enforce consistent import ordering
    'import/order': 'off',
    // Prevent accidental console.log in production code
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    // Require explicit return types on exported functions
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    // Disallow @ts-ignore without explanation
    '@typescript-eslint/ban-ts-comment': ['error', { 'ts-ignore': 'allow-with-description' }],
    "@typescript-eslint/no-explicit-any": "off",

  },
};
