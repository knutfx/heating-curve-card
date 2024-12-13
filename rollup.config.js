const resolve = require('@rollup/plugin-node-resolve');
const terser = require('rollup-plugin-terser').terser;

module.exports = {
  input: 'src/heating-curve-card.js',
  output: {
    file: 'heating-curve-card.js',
    format: 'es',
  },
  plugins: [
    resolve(),
    terser()
  ]
};