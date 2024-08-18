import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'
import jwt from 'jsonwebtoken'

import { app } from '../app'
import { createAndAuthenticateUser } from '@/utils/tests/create-and-authenticate'

describe('Transactions routes (e2e)', () => {
	beforeAll(async () => {
		await app.ready()
	})

	afterAll(async () => {
		await app.close()
	})

	it('should be able to create a new transaction', async () => {
		const { token } = await createAndAuthenticateUser(app)
		const tokenDecoded = jwt.decode(token)
		const response = await request(app.server).post('/transactions').set('Authorization', `${token}`).send({
			title: 'Test Transaction',
			amount: 1000,
			type: 'credit',
			userId: tokenDecoded?.sub
		})

		expect(response.statusCode).toEqual(201)
	})

	it('should be able to list all transactions', async () => {
		const { token } = await createAndAuthenticateUser(app)
		const response = await request(app.server).get('/transactions').set('Authorization', `${token}`)

		expect(response.statusCode).toEqual(200)
	})
})
