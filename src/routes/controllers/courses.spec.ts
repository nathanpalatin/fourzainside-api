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

	it('should be able to list all courses from user', async () => {
		const { token, userId } = await createAndAuthenticateUser(app)

		const coursesResponse = await request(app.server)
			.get(`/courses/${userId}`)
			.set('Authorization', `${token}`)
			.send()

		expect(coursesResponse.statusCode).toEqual(200)
		expect(coursesResponse.body.courses.length).toBeGreaterThanOrEqual(0)
	})

	it('should be able to create a course', async () => {
		const { token } = await createAndAuthenticateUser(app, true)

		const courseResponse = await request(app.server)
			.post('/courses')
			.set('Authorization', `${token}`)
			.send({
				title: 'Introduction to JavaScript',
				description: 'This course will teach you the basics of JavaScript.',
				image: 'teste.png',
				type: 'image/png',
				level: 'advanced',
				tags: ['JavaScript', 'programming'],
				duration: 180
			})

		expect(courseResponse.statusCode).toEqual(201)
	})
})
