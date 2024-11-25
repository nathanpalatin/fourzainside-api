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
				type: 'image/png',
				level: 'advanced',
				tags: ['JavaScript', 'programming']
			})

		const moduleResponse = await request(app.server)
			.post('/modules')
			.set('Authorization', `${token}`)
			.send({
				title: 'Introduction to JavaScript',
				description: 'This course will teach you the basics of JavaScript.',
				available: '7 dias',
				visibility: true,
				courseId: courseResponse.body.id
			})

		const lessonResponse = await request(app.server)
			.post('/lessons')
			.set('Authorization', `${token}`)
			.send({
				title: 'Introduction to JavaScript',
				description: 'This course will teach you the basics of JavaScript.',
				courseId: courseResponse.body.id,
				moduleId: moduleResponse.body.id,
				video: 'video.mp4'
			})

		expect(lessonResponse.statusCode).toEqual(201)
	})

	it('should be able to list all lessons', async () => {
		const { token } = await createAndAuthenticateUser(app, true, true)
		const courseResponse = await request(app.server)
			.post('/courses')
			.set('Authorization', `${token}`)
			.send({
				title: 'Introduction to JavaScript',
				description: 'This course will teach you the basics of JavaScript.',
				type: 'image/png',
				level: 'advanced',
				tags: ['JavaScript', 'programming']
			})

		const moduleResponse = await request(app.server)
			.post('/modules')
			.set('Authorization', `${token}`)
			.send({
				title: 'Introduction to JavaScript',
				description: 'This course will teach you the basics of JavaScript.',
				available: '7 dias',
				visibility: true,
				courseId: courseResponse.body.id
			})

		await request(app.server)
			.post('/lessons')
			.set('Authorization', `${token}`)
			.send({
				title: 'Introduction to JavaScript',
				description: 'This course will teach you the basics of JavaScript.',
				moduleId: moduleResponse.body.id,
				courseId: courseResponse.body.id,
				video: 'video.mp4'
			})

		const lessonResponse = await request(app.server)
			.get(`/lessons/${courseResponse.body.slug}/${moduleResponse.body.slug}`)
			.set('Authorization', `${token}`)
			.send()

		expect(lessonResponse.statusCode).toEqual(200)
	})
})
