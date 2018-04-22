module.exports = {
  root: true,
  parserOptions: {
    parser: 'babel-eslint',
  },
  env: {
    browser: true,
  },
  extends: ['airbnb-base'],
  settings: {
    'import/resolver': {
      webpack: {
        config: 'webpack.config.js',
      },
    },
  },
  rules: {
    'import/extensions': ['error', 'always', {
      js: 'never',
    }],
    'import/prefer-default-export': 0,
  },
};
