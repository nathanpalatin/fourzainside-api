import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'
import jwt from 'jsonwebtoken'

import { createAndAuthenticateUser } from '../utils/tests/create-and-authenticate'

import { app } from '../app'

describe('Products routes (e2e)', () => {
	beforeAll(async () => {
		await app.ready()
	})

	afterAll(async () => {
		await app.close()
	})

	it('should be able to create a new product', async () => {
		const { token } = await createAndAuthenticateUser(app)

		const parsedToken = jwt.decode(token)

		const response = await request(app.server).post('/products').set('Authorization', `${token}`).send({
			title: 'Produto teste 1',
			slug: 'produto-test-1',
			description: 'Esse foi um produto teste',
			price: 199,
			image: '',
			featured: true,
			userId: parsedToken?.sub
		})

		expect(response.statusCode).toEqual(201)
	})

	it('should be able to list all products', async () => {
		const { token } = await createAndAuthenticateUser(app)
		const response = await request(app.server).get('/products').set('Authorization', `${token}`)
		expect(response.statusCode).toEqual(200)
	})

	it('should be able to delete one product', async () => {
		const { token } = await createAndAuthenticateUser(app)
		const product = await request(app.server).delete(`/products`).set('Authorization', `${token}`)
		expect(product.statusCode).toEqual(204)
	})

	it('should be able to delete all products', async () => {
		const { token } = await createAndAuthenticateUser(app)
		const response = await request(app.server).delete(`/products`).set('Authorization', `${token}`)
		expect(response.statusCode).toEqual(204)
	})
})
