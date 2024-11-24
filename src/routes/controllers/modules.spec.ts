import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { app } from '../../app'

import { createAndAuthenticateUser } from '../../utils/tests/create-and-authenticate'

describe('Modules (e2e)', () => {
	beforeAll(async () => {
		await app.ready()
	})

	afterAll(async () => {
		await app.close()
	})

	it('should be able to create a module', async () => {
		const { token } = await createAndAuthenticateUser(app, true, true)

		const courseResponse = await request(app.server)
			.post('/courses')
			.set('Authorization', `${token}`)
			.send({
				title: 'Introduction to JavaScript',
				description: 'This course will teach you the basics of JavaScript.',
				image: 'teste.png',
				type: 'image/png',
				level: 'advanced',
				tags: ['JavaScript', 'programming']
			})

		const moduleResponse = await request(app.server)
			.post('/modules')
			.set('Authorization', `${token}`)
			.send({
				title: 'Introduction to JavaScript',
				courseId: courseResponse.body.id,
				description: 'This module will teach you the basics of JavaScript.',
				available: '7 dias',
				visibility: true
			})

		expect(moduleResponse.statusCode).toEqual(201)
	})
})
