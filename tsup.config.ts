import { defineConfig } from 'tsup'

export default defineConfig({
    entry: ['src/index.browser.ts', 'src/index.node.ts'],
    clean: true,
    shims: true,
    dts: true,
    format: ['cjs', 'esm'],
})