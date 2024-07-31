import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/preset.ts','src/index.ts' ], // Use entryPoints instead of entry
  outDir: 'dist',
  format: ['cjs', 'esm'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
});