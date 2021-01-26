module.exports = {
    extends: ['airbnb-typescript-prettier'],
    rules: {
      'react/jsx-filename-extension': [
        1,
        { extensions: ['.js', '.jsx', '.ts', '.tsx'] },
      ],
      'prettier/prettier': 'error',
      'react/jsx-wrap-multilines': 'off',
      'import/extensions': [
        'error',
        'never',
        {
          js: 'never',
          jsx: 'never',
          ts: 'never',
          tsx: 'never',
          json: 'always',
          css: 'always',
        },
      ],
      'import/no-unresolved': 'off', //[2, { caseSensitive: false }],
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      'react/jsx-props-no-spreading': 'off',
      'react-hooks/exhaustive-deps': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      'import/prefer-default-export': 'off'
    },
  };
  