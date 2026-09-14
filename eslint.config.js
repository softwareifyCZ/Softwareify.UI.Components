import js from '@eslint/js'
import tseslint from 'typescript-eslint'

/** Minimal flat ESLint config for library source. */
export default tseslint.config(
  {
    ignores: [
      'dist/**',
      'node_modules/**',
      'storybook-static/**',
      'coverage/**',
      '.storybook/**',
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['src/**/*.{ts,tsx}'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-empty-object-type': 'off',
      // Optional peer deps load via runtime require()
      '@typescript-eslint/no-require-imports': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
    },
  },
)
