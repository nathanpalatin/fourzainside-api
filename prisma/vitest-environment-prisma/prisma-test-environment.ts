import { Environment } from 'vitest'

export default <Environment>{
	name: 'prisma',
	transformMode: 'web',
	async setup() {
		console.log('Starting')
		return {
			teardown() {
				console.log('Teardown')
			}
		}
	}
}
