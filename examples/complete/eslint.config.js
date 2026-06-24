import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: ['node_modules/**', 'coverage/**', 'dist/**', '*.config.js'],
  },
  ...tseslint.configs.recommended,
  {
    rules: {
      // Layered Params/Result types are modeled with TS namespaces.
      '@typescript-eslint/no-namespace': 'off',
    },
  },
);
