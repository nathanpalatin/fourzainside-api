import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'
import jwt, { JwtPayload } from 'jsonwebtoken'

import { app } from '../app'
import { createAndAuthenticateUser } from '../utils/tests/create-and-authenticate'

describe('Upload files routes (e2e)', () => {
	beforeAll(async () => {
		await app.ready()
	})

	afterAll(async () => {
		await app.close()
	})

	it('should be able to upload a file', async () => {
		const { token } = await createAndAuthenticateUser(app)
		const tokenDecoded = jwt.decode(token) as JwtPayload
		const response = await request(app.server).post('/users/uploads').set('Authorization', `${token}`).send({
			name: 'video.mp4',
			contentType: 'video/mp4',
			userId: tokenDecoded?.userId
		})

		expect(response.statusCode).toEqual(200)
	})
})
