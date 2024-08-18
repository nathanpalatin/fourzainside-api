import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'
import jwt from 'jsonwebtoken'

import { app } from '../app'

describe('Products routes (e2e)', () => {
	beforeAll(async () => {
		await app.ready()
	})

	afterAll(async () => {
		await app.close()
	})

	/* it('should be able to create a new product', async () => {
		const response = await request(app.server).post('/users').send({
			name: 'Nathan Palatin',
			email: 'email@nathan.com',
			username: 'nathanpalatin',
			password: '123456',
			phone: '47999999999'
		})
		expect(response.statusCode).toEqual(201)
	}) */

	it('should be able to list all products', async () => {
		const user = await request(app.server).post('/users/login').send({
			credential: 'nathanpalatin',
			password: '123456'
		})

		const token = user.body.token
		const response = await request(app.server).get('/products').set('Authorization', `${token}`)
		expect(response.statusCode).toEqual(200)
	})
})
