import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'
import jwt, { JwtPayload } from 'jsonwebtoken'

import { app } from '../app'
import { createAndAuthenticateUser } from '../utils/tests/create-and-authenticate'

describe('Users routes (e2e)', () => {
	beforeAll(async () => {
		await app.ready()
	})

	afterAll(async () => {
		await app.close()
	})

	it('should be able to create a new user', async () => {
		const response = await request(app.server).post('/users').send({
			name: 'Nathan Palatin',
			email: 'email@nathan.com',
			username: 'nathanpalatin',
			password: '123456',
			phone: '47999999999'
		})
		expect(response.statusCode).toEqual(201)
	})

	it('should be able to log in', async () => {
		const response = await request(app.server).post('/users/login').send({
			credential: 'nathanpalatin',
			password: '123456'
		})
		expect(response.statusCode).toEqual(200)
	})

	it('should be able to list all users', async () => {
		const { token } = await createAndAuthenticateUser(app)
		const response = await request(app.server).get('/users/').set('Authorization', `${token}`)
		expect(response.statusCode).toEqual(200)
	})

	it('should be able to update a user', async () => {
		const { token } = await createAndAuthenticateUser(app)
		const response = await request(app.server).put('/users').set('Authorization', `${token}`).send({
			name: 'John Doe2',
			username: 'johndoe',
			password: '123456',
			phone: '1233333'
		})
		expect(response.statusCode).toEqual(204)
	})

	it('should be able to delete account', async () => {
		const { token } = await createAndAuthenticateUser(app)
		const response = await request(app.server).delete('/users').set('Authorization', `${token}`)

		expect(response.statusCode).toEqual(204)
	})
})
