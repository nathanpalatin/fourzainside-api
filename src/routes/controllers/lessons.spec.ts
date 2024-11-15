import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { app } from '../../app'

import { createAndAuthenticateUser } from '../../utils/tests/create-and-authenticate'

describe('Lessons (e2e)', () => {
	beforeAll(async () => {
		await app.ready()
	})

	afterAll(async () => {
		await app.close()
	})
	it('should be able to create a lesson', async () => {
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
				tags: ['JavaScript', 'programming'],
				duration: 180
			})

		const lessonResponse = await request(app.server)
			.post('/lessons')
			.set('Authorization', `${token}`)
			.send({
				title: 'Introduction to JavaScript',
				description: 'This course will teach you the basics of JavaScript.',
				duration: 180,
				courseId: courseResponse.body.id,
				video: 'video.mp4'
			})

		expect(lessonResponse.statusCode).toEqual(201)
	})

	it('should be able to list all lessons from course', async () => {
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
				tags: ['JavaScript', 'programming'],
				duration: 180
			})
		const createdLessonResponse = await request(app.server)
			.post('/lessons')
			.set('Authorization', `${token}`)
			.send({
				title: 'Introduction to JavaScript',
				description: 'This course will teach you the basics of JavaScript.',
				duration: 180,
				courseId: courseResponse.body.id,
				video: 'video.mp4'
			})

		const lessonResponse = await request(app.server)
			.get(`/lessons/${createdLessonResponse.body.id}`)
			.set('Authorization', `${token}`)
			.send()

		expect(lessonResponse.statusCode).toEqual(200)
	})
})
