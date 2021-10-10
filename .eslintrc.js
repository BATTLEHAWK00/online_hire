module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'plugin:vue/essential',
    'plugin:@typescript-eslint/recommended',
    'airbnb-base',
    'prettier',
  ],
  parser: 'vue-eslint-parser',
  parserOptions: {
    ecmaVersion: 12,
    parser: '@typescript-eslint/parser',
    sourceType: 'module',
    ecmaFeatures: {
      legacyDecorators: true,
    },
    extraFileExtensions: ['.vue'],
  },
  plugins: ['html'],
  rules: {
    '@typescript-eslint/explicit-module-boundary-types': 0,
    '@typescript-eslint/ban-ts-comment': 1,
    'no-plusplus': 0,
    'import/extensions': 0,
    'import/no-unresolved': 0,
    'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
    'lines-between-class-members': 0,
  },
  overrides: [
    {
      files: ['*.js', '*.vue'],
      extends: ['plugin:vue/essential', 'eslint:recommended', 'prettier'],
      rules: {
        '@typescript-eslint/no-var-requires': 0,
        'global-require': 0,
        'no-underscore-dangle': 0,
      },
    },
    {
      files: ['*.ts', '*.js'],
      excludedFiles: ['src/ui/**/*'],
      rules: {
        'no-console': 0,
        'no-param-reassign': 0,
        'max-classes-per-file': 0,
        'no-underscore-dangle': 0,
        'no-continue': 0,
        '@typescript-eslint/no-explicit-any': 1,
        '@typescript-eslint/ban-ts-comment': 1,
      },
    },
  ],
};
