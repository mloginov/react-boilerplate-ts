// const eslintPluginPrettierRecommended = require('eslint-plugin-prettier/recommended');
// const reactPlugin = require('eslint-plugin-react');
//
// module.exports = [
//   reactPlugin.configs.flat.recommended, // This is not a plugin object, but a shareable config object
//   reactPlugin.configs.flat['jsx-runtime'], // Add this if you are using React 17+
//   eslintPluginPrettierRecommended,
//   {
//     files: ['**/*.{js,mjs,cjs,jsx,mjsx,ts,tsx,mtsx}'],
//     settings: {
//       react: {
//         version: 'detect',
//       },
//     },
//   },
// ];

// @ts-check

import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import reactPlugin from 'eslint-plugin-react';
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  eslint.configs.recommended,
  reactPlugin.configs.flat.recommended,
  reactPlugin.configs.flat['jsx-runtime'],
  eslintPluginPrettierRecommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{js,mjs,cjs,jsx,mjsx,ts,tsx,mtsx}'],
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      '@typescript-eslint/no-empty-object-type': 'off',
    },
  },
);
