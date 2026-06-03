import js from '@eslint/js'
import globals from 'globals'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import prettier from 'eslint-config-prettier'

export default [
  { ignores: ['dist/**', 'node_modules/**'] },

  js.configs.recommended,
  react.configs.flat.recommended,
  react.configs.flat['jsx-runtime'],

  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: { ...globals.browser, ...globals.node },
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    settings: { react: { version: '18.3' } },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      // Real-bug rules stay as errors:
      'react-hooks/rules-of-hooks': 'error',

      // Prototype-sandbox ergonomics — surface as warnings, don't fail the build:
      'react-hooks/exhaustive-deps': 'warn',
      'no-unused-vars': ['warn', { varsIgnorePattern: '^[A-Z_]', argsIgnorePattern: '^_' }],

      // Fast Refresh hygiene only — irrelevant to a static prototype build, and it
      // drowned out real warnings (97 of them). Off so `pnpm lint` stays meaningful.
      'react-refresh/only-export-components': 'off',

      // This codebase doesn't use PropTypes; JSX is unescaped on purpose in copy;
      // component factories return anonymous components by design.
      'react/prop-types': 'off',
      'react/no-unescaped-entities': 'off',
      'react/display-name': 'off',

      'no-empty': ['error', { allowEmptyCatch: true }],
    },
  },

  // Keep ESLint out of Prettier's lane (must be last).
  prettier,
]
