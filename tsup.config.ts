import { defineConfig } from 'tsup'

export default defineConfig({
	entry: ['src'],
	format: ['cjs', 'esm'],
	onSuccess: 'node copy-package.mjs',
	outDir: 'build',
	splitting: false,
	sourcemap: true,
	clean: true,
	external: ['mock-aws-s3', 'aws-sdk', 'nock', '#async_hooks'],
	target: 'es2020'
})
