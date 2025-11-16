module.exports = [
  {
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'module',
      globals: {
        require: 'readonly',
        module: 'readonly',
        exports: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        process: 'readonly',
        console: 'readonly',
        Buffer: 'readonly',
        global: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        setInterval: 'readonly',
        clearInterval: 'readonly',
        window: 'readonly',
        document: 'readonly',
        fetch: 'readonly',
        alert: 'readonly',
        confirm: 'readonly'
      }
    },
    rules: {
      'no-console': 'error',
      eqeqeq: 'error',
      camelcase: 'error',
      'no-unused-vars': 'error',
      quotes: ['error', 'single'],
      semi: ['error', 'always'],
      'max-lines-per-function': ['error', 20]
    }
  }
];
