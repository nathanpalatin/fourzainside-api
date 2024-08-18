import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'
import jwt from 'jsonwebtoken'

import { app } from '../app'

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
		const user = await request(app.server).post('/users/login').send({
			credential: 'nathanpalatin',
			password: '123456'
		})

		const token = user.body.token

		const response = await request(app.server).get('/users/').set('Authorization', `${token}`)
		expect(response.statusCode).toEqual(200)
	})

	it('should be able to update a user', async () => {
		const loginResponse = await request(app.server).post('/users/login').send({
			credential: 'nathanpalatin',
			password: '123456'
		})

		const token = loginResponse.body.token

		const response = await request(app.server).put('/users').set('Authorization', `${token}`).send({
			name: 'Nathan Palatin',
			username: 'nathanpalatin',
			password: '123',
			phone: '1999999999'
		})
		expect(response.statusCode).toEqual(204)
	})

	it('should be able to delete user', async () => {
		const loginResponse = await request(app.server).post('/users/login').send({
			credential: 'nathanpalatin',
			password: '123'
		})

		const token = loginResponse.body.token
		const decodedToken = jwt.decode(token)

		const response = await request(app.server).delete(`/users/${decodedToken}`).set('Authorization', `${token}`)

		expect(response.statusCode).toEqual(204)
	})
})
