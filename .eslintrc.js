module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'prettier',
    'plugin:vue/essential',
    // 'eslint:recommended',
    // 'plugin:@typescript-eslint/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 12,
    // parser: 'babel-eslint',
    sourceType: 'module',
    ecmaFeatures: {
      legacyDecorators: true,
    },
    extraFileExtensions: ['.vue']
  },
  plugins: ['html', '@typescript-eslint', 'vue'],
  rules: {
    '@typescript-eslint/explicit-module-boundary-types': 0,
  },
  // ignorePatterns: ['node_modules/**', '.idea/**'],
};
