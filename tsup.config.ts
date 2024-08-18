import { defineConfig } from 'tsup'

export default defineConfig({
	entry: ['src/server.ts'],
	external: ['mock-aws-s3', 'aws-sdk', 'nock', '#async_hooks'],
	target: 'es2020'
})
