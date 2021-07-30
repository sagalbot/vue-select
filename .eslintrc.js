module.exports = {
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: 'babel-eslint',
    sourceType: 'module',
  },
  plugins: ['prettier'],
  extends: [
    'plugin:prettier/recommended',
    'plugin:vue/recommended',
    'prettier/vue',
  ],
  ignorePatterns: ['node_modules/', 'dist/', 'coverage/'],
}
