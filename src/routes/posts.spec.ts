import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'
import jwt, { JwtPayload } from 'jsonwebtoken'

import { createAndAuthenticateUser } from '../utils/tests/create-and-authenticate'

import { app } from '../app'

describe('Posts routes (e2e)', () => {
	beforeAll(async () => {
		await app.ready()
	})

	afterAll(async () => {
		await app.close()
	})

	it('should be able to create a new post', async () => {
		const { token } = await createAndAuthenticateUser(app)
		const parsedToken = jwt.decode(token) as JwtPayload
		const response = await request(app.server).post('/posts').set('Authorization', `${token}`).send({
			title: 'Post teste 1',
			content: 'Esse foi um post teste',
			userId: parsedToken.userId
		})

		expect(response.statusCode).toEqual(201)
	})

	it('should be able to list all posts', async () => {
		const { token } = await createAndAuthenticateUser(app)
		const response = await request(app.server).get('/posts').set('Authorization', `${token}`)

		expect(response.statusCode).toEqual(200)
	})
})
