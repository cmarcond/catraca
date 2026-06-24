import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: ['node_modules', 'coverage', 'dist'],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    rules: {
      // Namespaced use-case/protocol types (Params/Result) are a deliberate
      // Clean Architecture convention in this project — see .catraca/architecture.md.
      '@typescript-eslint/no-namespace': 'off',
    },
  },
);
