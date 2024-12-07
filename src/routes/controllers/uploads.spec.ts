import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { app } from '../../app'

import { createAndAuthenticateUser } from '../../utils/tests/create-and-authenticate'

describe('Uploads (e2e)', () => {
	beforeAll(async () => {
		await app.ready()
	})

	afterAll(async () => {
		await app.close()
	})

	it('should be able to upload a file', async () => {
		const { token } = await createAndAuthenticateUser(app, false, true)

		const response = await request(app.server)
			.post('/uploads')
			.set('Authorization', `${token}`)
			.attach('file', Buffer.from('conteúdo de teste'), {
				filename: 'test-file.txt',
				contentType: 'text/plain'
			})

		expect(response.status).toBe(200)
		expect(response.body).toHaveProperty('url')
	})
})
