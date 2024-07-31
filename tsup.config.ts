import { defineConfig } from 'tsup';

export default defineConfig({
    entry: ['src/addon/preset.ts'],
    outDir: 'dist',
    format: ['cjs', 'esm'],
    dts: true,
    splitting: false,
    sourcemap: true,
    clean: true,
    external: ['esbuild'], // Mark esbuild as external
});
