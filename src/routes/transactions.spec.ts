import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest'
import request from 'supertest'
import jwt, { JwtPayload } from 'jsonwebtoken'

import { app } from '../app'
import { createAndAuthenticateUser } from '../utils/tests/create-and-authenticate'

describe('Transactions routes (e2e)', () => {
	beforeAll(async () => {
		await app.ready()
	})

	afterAll(async () => {
		await app.close()
	})

	it('should be able to create a new transaction', async () => {
		const { token } = await createAndAuthenticateUser(app)
		const tokenDecoded = jwt.decode(token) as JwtPayload
		const response = await request(app.server).post('/transactions').set('Authorization', `${token}`).send({
			title: 'Test Transaction',
			amount: 1000,
			type: 'credit',
			userId: tokenDecoded?.userId
		})

		expect(response.statusCode).toEqual(201)
	})

	it('should be able to list all transactions', async () => {
		const { token } = await createAndAuthenticateUser(app)
		const response = await request(app.server).get('/transactions').set('Authorization', `${token}`)

		expect(response.statusCode).toEqual(200)
	})

	it('should be able to get one transaction', async () => {
		const { token } = await createAndAuthenticateUser(app)

		const response = await request(app.server)
			.get(`/transactions/329f9cda-30ef-4d82-908e-72ee6b649ed9`)
			.set('Authorization', `${token}`)

		expect(response.statusCode).toEqual(200)
	})

	it('should be able to update a transaction', async () => {
		const { token } = await createAndAuthenticateUser(app)
		const response = await request(app.server)
			.put(`/transactions/329f9cda-30ef-4d82-908e-72ee6b649ed9`)
			.set('Authorization', `${token}`)
			.send({
				title: 'Test Transaction 2',
				amount: 1000,
				type: 'debit'
			})

		expect(response.statusCode).toEqual(204)
	})
})
