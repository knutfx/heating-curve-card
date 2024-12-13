import resolve from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';

export default {
  input: 'src/heating-curve-card.js',
  output: {
    dir: 'dist',
    format: 'es',
  },
  plugins: [
    resolve(),
    terser(),
  ],
};