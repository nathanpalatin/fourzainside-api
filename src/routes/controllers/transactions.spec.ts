import request from 'supertest'

import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { app } from '../../app'

import { createAndAuthenticateUser } from '../../utils/tests/create-and-authenticate'

describe('Transactions (e2e)', () => {
	beforeAll(async () => {
		await app.ready()
	})

	afterAll(async () => {
		await app.close()
	})

	it('should be able to list all transactions', async () => {
		const { token } = await createAndAuthenticateUser(app)

		const transactionResponse = await request(app.server)
			.get('/transactions')
			.set('Authorization', `${token}`)
			.send()
		expect(transactionResponse.statusCode).toEqual(200)
	})

	it('should be able to create a transaction', async () => {
		const { token } = await createAndAuthenticateUser(app)

		const transactionResponse = await request(app.server)
			.post('/transactions')
			.set('Authorization', `${token}`)
			.send({
				title: 'Create a transaction',
				amount: 1000,
				type: 'credit'
			})
		expect(transactionResponse.statusCode).toEqual(201)
	})

	it('should be able to get a transaction', async () => {
		const { token } = await createAndAuthenticateUser(app)

		const transactionResponse = await request(app.server)
			.post('/transactions')
			.set('Authorization', `${token}`)
			.send({
				title: 'Create a transaction',
				amount: 1000,
				type: 'credit'
			})

		const transactionId = await request(app.server)
			.get(`/transactions/${transactionResponse.body.id}`)
			.set('Authorization', `${token}`)
			.send()

		expect(transactionId.statusCode).toEqual(200)
	})
})
