import { defineConfig } from 'tsup'

export default defineConfig({
	entry: ['src'],
	format: ['cjs', 'esm'],
	outDir: 'build',
	splitting: false,
	sourcemap: true,
	clean: true,
	external: ['#async_hooks'],
	target: 'es2022'
})
