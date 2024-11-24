import { app } from '../../app'

import request from 'supertest'
import { hash } from 'bcrypt'

import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { createAndAuthenticateUser } from '../../utils/tests/create-and-authenticate'

describe('Users routes (e2e)', () => {
	beforeAll(async () => {
		await app.ready()
	})

	afterAll(async () => {
		await app.close()
	})

	it.skip('should be able to create a new user', async () => {
		const userResponse = await request(app.server).post('/users').send({
			name: 'John Doe',
			phone: '+554799999999',
			email: 'johndoe@example.com',
			password: '123456'
		})

		expect(userResponse.statusCode).toEqual(201)
	})

	it('should be able to log in', async () => {
		const { token } = await createAndAuthenticateUser(app, false, true)

		expect(token).toEqual(expect.any(String))
	})

	it('should be able to refresh token from user authenticated', async () => {
		const { refreshToken } = await createAndAuthenticateUser(app, false, true)

		const response = await request(app.server)
			.patch('/users/token/refresh')
			.send({
				refreshToken
			})

		expect(response.status).toEqual(200)
		expect(response.body).toEqual({
			token: expect.any(String),
			refreshToken: expect.any(String)
		})
	})

	it('should be able to update a user', async () => {
		const { token } = await createAndAuthenticateUser(app, false, true)

		const updateData = {
			name: 'John Updated',
			phone: '+554799988888'
		}

		const updateResponse = await request(app.server)
			.put('/users')
			.set('Authorization', `${token}`)
			.send(updateData)

		expect(updateResponse.status).toBe(204)
	})

	it('should be able to delete a user', async () => {
		const { token } = await createAndAuthenticateUser(app, false, true)

		const updateResponse = await request(app.server)
			.delete('/users')
			.set('Authorization', `${token}`)
			.send()

		expect(updateResponse.status).toBe(204)
	})

	it('should be able to recovery user password', async () => {
		const { email } = await createAndAuthenticateUser(app, false, true)

		const updateResponse = await request(app.server)
			.post('/users/password')
			.send({ credential: email })

		expect(updateResponse.status).toBe(204)
	})
})
