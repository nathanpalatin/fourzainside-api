import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import request from 'supertest'
import { createReadStream } from 'node:fs'
import path from 'node:path'

import { app } from '../app'
import { createAndAuthenticateUser } from '../utils/tests/create-and-authenticate'

describe('Users routes (e2e)', () => {
	beforeAll(async () => {
		await app.ready()
	})

	afterAll(async () => {
		await app.close()
	})

	beforeEach(async () => {
		await createAndAuthenticateUser(app)
	})

	it('should be able to create a new user', async () => {
		const response = await request(app.server).post('/users').send({
			name: 'Nathan Palatin',
			email: 'email@nathan.com',
			username: 'nathanpalatin',
			password: '123456',
			phone: '47999999999'
		})
		expect(response.statusCode).toEqual(201)
	})

	it('should be able to log in', async () => {
		const response = await request(app.server).post('/users/login').send({
			credential: 'nathanpalatin',
			password: '123456'
		})
		expect(response.statusCode).toEqual(200)
	})

	it('should not be able to log in with empty credentials', async () => {
		const response = await request(app.server).post('/users/login').send({
			credential: '',
			password: ''
		})
		expect(response.statusCode).toEqual(500)
	})

	it('try to log in without user registred.', async () => {
		const response = await request(app.server).post('/users/login').send({
			credential: 'nathanp',
			password: '123456'
		})
		expect(response.statusCode).toEqual(404)
	})

	it('try to log in with wrong password.', async () => {
		const response = await request(app.server).post('/users/login').send({
			credential: 'nathanpalatin',
			password: '123123'
		})
		expect(response.statusCode).toEqual(403)
	})

	it('should be able to list all users', async () => {
		const { token } = await createAndAuthenticateUser(app)
		const response = await request(app.server).get('/users/').set('Authorization', `${token}`)
		expect(response.statusCode).toEqual(200)
	})

	it('should be able to list a user by nickname', async () => {
		const { token, username } = await createAndAuthenticateUser(app)
		const response = await request(app.server).get(`/users/${username}`).set('Authorization', `${token}`)
		expect(response.statusCode).toEqual(200)
	})

	it('should be able to send file for the avatar', async () => {
		const { token } = await createAndAuthenticateUser(app)
		const filePath = path.resolve(__dirname, '../../uploads', 'favicon.png')
		const stream = createReadStream(filePath)
		const response = await request(app.server)
			.patch('/users/avatar')
			.set('Authorization', `${token}`)
			.attach('file', stream.path)

		expect(response.statusCode).toEqual(200)
	})

	it.skip('should not be able to change avatar without file', async () => {
		const { token } = await createAndAuthenticateUser(app)
		const filePath = path.resolve(__dirname, '../../uploads', 'favicon.png')

		const response = await request(app.server).patch('/users/avatar').set('Authorization', `${token}`)
		expect(response.statusCode).toEqual(400)
	})

	it('should be able to update a user', async () => {
		const { token } = await createAndAuthenticateUser(app)
		const response = await request(app.server).put('/users').set('Authorization', `${token}`).send({
			name: 'John Doe2',
			username: 'johndoe',
			password: '123456',
			phone: '1233333'
		})
		expect(response.statusCode).toEqual(204)
	})

	it('should be able to send email to reset password', async () => {
		const response = await request(app.server).post('/users/password').send({
			credential: 'johndoe'
		})
		expect(response.statusCode).toEqual(200)
	})

	it('should be able to delete account', async () => {
		const { token } = await createAndAuthenticateUser(app)
		const response = await request(app.server).delete('/users').set('Authorization', `${token}`)

		expect(response.statusCode).toEqual(204)
	})
})
