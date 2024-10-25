import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { app } from '../../app'

import { createAndAuthenticateUser } from '../../utils/tests/create-and-authenticate'

describe('Courses (e2e)', () => {
	beforeAll(async () => {
		await app.ready()
	})

	afterAll(async () => {
		await app.close()
	})

	it('should be able to create a course', async () => {
		const { token } = await createAndAuthenticateUser(app, true)

		const courseResponse = await request(app.server)
			.post('/courses')
			.set('Authorization', `${token}`)
			.send({
				title: 'Introduction to JavaScript',
				description: 'This course will teach you the basics of JavaScript.',
				startDate: '2022-01-01',
				image: 'teste.png',
				type: 'image/png',
				level: 'advanced',
				tags: ['JavaScript', 'programming'],
				endDate: '2022-06-30',
				duration: 180
			})

		expect(courseResponse.statusCode).toEqual(201)
	})
})
