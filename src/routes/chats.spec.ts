import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'
import jwt, { JwtPayload } from 'jsonwebtoken'

import { createAndAuthenticateUser } from '../utils/tests/create-and-authenticate'

import { app } from '../app'

describe('Chats routes (e2e)', () => {
	beforeAll(async () => {
		await app.ready()
	})

	afterAll(async () => {
		await app.close()
	})

	it('should be able to start a chat', async () => {
		const { token } = await createAndAuthenticateUser(app)
		const parsedToken = jwt.decode(token) as JwtPayload

		const response = await request(app.server).post('/chats').set('Authorization', `${token}`).send({
			chatWithId: parsedToken.userId
		})

		expect(response.statusCode).toEqual(201)
	})
})
