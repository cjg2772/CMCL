import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['electron/main.ts', 'electron/preload.ts'],
  format: ['esm'],
  splitting: false,
  sourcemap: true,
  clean: true,
  dts: false,
  target: 'node20',
  outDir: 'dist-electron',
  platform: 'node',
  shims: false,
  external: ['electron'],
  bundle: true,
})
