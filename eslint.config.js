// @ts-check
import { nodecfdiConfig } from '@nodecfdi/eslint-config';
import { defineFlatConfig } from 'eslint-define-config';

export default defineFlatConfig([
  ...nodecfdiConfig({ adonisjs: true }),
  {
    files: [
      'src/sorts/sort.ts',
      'src/filters/filter.ts',
      'src/includes/include.ts',
      'src/bindings/**/*.ts',
    ],
    rules: {
      '@typescript-eslint/consistent-type-definitions': 'off',
      '@typescript-eslint/no-shadow': 'off',
    },
  },
  {
    files: ['src/**/*.ts'],
    rules: {
      '@typescript-eslint/no-base-to-string': 'off',
      'unicorn/no-array-callback-reference': 'off',
      'unicorn/no-array-method-this-argument': 'off',
    },
  },
]);
