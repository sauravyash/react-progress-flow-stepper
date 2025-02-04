import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import packageJson from './package.json' assert { type: 'json' };

export default {
  input: 'src/index.ts',
  external: [
    ...Object.keys(packageJson.peerDependencies || {}),
    "react/jsx-runtime"
  ],
  output: [
    {
      file: packageJson.main,        // e.g. "dist/index.cjs.js"
      format: 'cjs',
      sourcemap: true
    },
    {
      file: packageJson.module,      // e.g. "dist/index.esm.js"
      format: 'esm',
      sourcemap: true
    }
  ],
  plugins: [
    resolve(),
    commonjs(),
    typescript({ tsconfig: './tsconfig.json' }),
  ]
};
