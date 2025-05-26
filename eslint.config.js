import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import reactPlugin from 'eslint-plugin-react'
import importPlugin from 'eslint-plugin-import'
import prettierPlugin from 'eslint-plugin-prettier'

export default [
  js.configs.recommended,

  // Apply type-aware rules ONLY inside your TS project
  {
    files: ['src/**/*.ts', 'src/**/*.tsx'],
    ...tseslint.configs.recommendedTypeChecked[0], // type-aware config
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: process.cwd(),
        ecmaFeatures: { jsx: true },
      },
    },
    plugins: {
      '@typescript-eslint': tseslint.plugin,
      react: reactPlugin,
      import: importPlugin,
      prettier: prettierPlugin,
    },
    settings: {
      react: { version: 'detect' },
    },
    rules: {
      'no-multi-spaces': 'error',
      'array-callback-return': 'error',
      'object-curly-spacing': ['error', 'always'],
      'import/newline-after-import': 'error',
      'import/no-absolute-path': 'error',
      'prettier/prettier': 'error',

      'react/no-children-prop': 'off',
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'react/display-name': 'error',
      'react/jsx-key': 'error',
      'react/no-unknown-property': 'error',

      '@typescript-eslint/no-empty-interface': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
    },
  }
]