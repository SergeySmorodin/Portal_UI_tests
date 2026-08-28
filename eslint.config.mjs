import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-config-prettier';

export default tseslint.config(
  {
    ignores: [
      'node_modules/**',
      'test-results/**',
      'test-results.json',
      'playwright-report/**',
      'playwright/.auth/**',
    ],
  },

  // Основной код на TypeScript
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    rules: {
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'no-empty': ['error', { allowEmptyCatch: true }],
    },
  },

  // Отдельные Node-скрипты (вне основного тестового кода):
  // - scripts/**/*.js, *.cjs — CommonJS (require), Node globals
  // - scripts/**/*.mjs — ESM Node-скрипты (используют document внутри page.evaluate, process, Buffer)
  {
    files: ['scripts/**/*.{js,cjs}'],
    languageOptions: {
      globals: {
        require: 'readonly',
        process: 'readonly',
        console: 'readonly',
        Buffer: 'readonly',
        __dirname: 'readonly',
      },
    },
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
    },
  },
  {
    files: ['scripts/**/*.mjs'],
    languageOptions: {
      globals: {
        process: 'readonly',
        console: 'readonly',
        Buffer: 'readonly',
        __dirname: 'readonly',
        document: 'readonly',
      },
    },
    rules: {
      '@typescript-eslint/no-unused-vars': 'off',
    },
  },

  prettier
);
