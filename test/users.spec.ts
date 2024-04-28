import { afterAll, beforeAll, describe, it } from 'vitest'
import request from 'supertest'
import { app } from '../src/app'

describe('Users routes', () => {
	beforeAll(async () => {
		await app.ready()
	})

	afterAll(async () => {
		await app.close()
	})

	it('should be able to create a new user', async () => {
		await request(app.server)
			.post('/users')
			.send({
				name: 'Nathan',
				username: 'nathan',
				password: 'Tudo@2020',
				email: 'email@nathan.com',
				phone: '+5547999999999',
			})
			.expect(201)
	})
	
})
