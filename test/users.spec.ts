import { afterAll, beforeAll, beforeEach, describe, it } from 'vitest'
import { execSync } from 'node:child_process'
import request from 'supertest'
import { app } from '../src/app'

describe('Users routes', () => {
	beforeAll(async () => {
		await app.ready()
	})

	afterAll(async () => {
		await app.close()
	})

	beforeEach(() => {
		execSync('npm run knex migrate:rollback --all')
		execSync('npm run knex migrate:latest')
	})

	it('should be able to create a new transaction', async () => {
		await request(app.server)
			.post('/users')
			.send({
				title: 'New transaction',
				amount: 5000,
				type: 'credit',
				userId: '04705cf3-aebf-423a-b2fc-f60f10b55fba'
			})
			.expect(201)
	})
	
})
