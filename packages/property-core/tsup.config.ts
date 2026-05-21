import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  dts: false,          //disable broken dts pipeline
  clean: true,
  target: 'es2022',
  splitting: false,
  sourcemap: true,
});