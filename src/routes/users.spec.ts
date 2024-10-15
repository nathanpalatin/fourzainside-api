import { app } from '../app'
import request from 'supertest'

import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import path from 'node:path'
import { createReadStream } from 'node:fs'

import { createAndAuthenticateUser } from '../utils/tests/create-and-authenticate'
import { InMemoryUsersRepository } from '../repositories/in-memory/in-memory-users-repository'
import { AuthenticateUseCase } from '../use-cases/authentication'

let usersRepository: InMemoryUsersRepository
let sut: AuthenticateUseCase

describe('Users routes (e2e)', () => {
	beforeAll(async () => {
		await app.ready()
	})

	afterAll(async () => {
		await app.close()
	})

	beforeEach(() => {
		usersRepository = new InMemoryUsersRepository()
		sut = new AuthenticateUseCase(usersRepository)
	})

	it('should be able to create a new user', async () => {
		const response = await request(app.server).post('/users').send({
			name: 'Nathan Palatin',
			email: 'email@email.com',
			cpf: '999.999.999-99',
			birthdate: '1993-06-14T00:00:00.000Z',
			password: '123456',
			phone: '47999999999'
		})
		expect(response.statusCode).toEqual(201)
	})

	it('should be able to log in', async () => {
		await createAndAuthenticateUser(app)
		const response = await request(app.server).post('/users/login').send({
			credential: 'email@example.com',
			password: '123456'
		})
		expect(response.statusCode).toEqual(200)
	})

	it('should be able to refresh a token', async () => {
		await createAndAuthenticateUser(app)
		const user = await request(app.server).post('/users/login').send({
			credential: 'email@example.com',
			password: '123456'
		})

		const cookies = user.get('Set-Cookie')

		const response = await request(app.server).patch('/users/token/refresh').set('Cookie', String(cookies))

		expect(response.statusCode).toEqual(200)
		expect(response.body).toEqual({
			token: expect.any(String),
			refreshToken: expect.any(String)
		})
	})

	it('should not be able to log in with empty credentials', async () => {
		const response = await request(app.server).post('/users/login').send({
			credential: '',
			password: ''
		})
		expect(response.statusCode).toEqual(400)
	})

	it('should not be to log in without user registred.', async () => {
		const response = await request(app.server).post('/users/login').send({
			credential: 'nathanp',
			password: '123456'
		})
		expect(response.statusCode).toEqual(400)
	})

	it('try to log in with wrong password.', async () => {
		await createAndAuthenticateUser(app)
		const response = await request(app.server).post('/users/login').send({
			credential: 'email@example.com',
			password: '1234561'
		})
		expect(response.statusCode).toEqual(400)
	})

	it('should be able to list all users', async () => {
		const { token } = await createAndAuthenticateUser(app)
		const response = await request(app.server).get('/users/').set('Authorization', `${token}`)
		expect(response.statusCode).toEqual(200)
	})

	it('should be able to list a user by nickname', async () => {
		const { token, name } = await createAndAuthenticateUser(app)
		const response = await request(app.server).get(`/users/${name}`).set('Authorization', `${token}`)
		expect(response.statusCode).toEqual(200)
	})

	it('should be able to send file for the avatar', async () => {
		const { token } = await createAndAuthenticateUser(app)
		const filePath = path.resolve(__dirname, '../../uploads', 'favicon.png')
		const stream = createReadStream(filePath)
		const response = await request(app.server)
			.patch('/users/avatar')
			.set('Authorization', `${token}`)
			.set('Content-Type', 'multipart/form-data')
			.attach('file', stream.path)

		expect(response.statusCode).toEqual(200)
	})

	it('should be able to update a user', async () => {
		const { token } = await createAndAuthenticateUser(app)
		const response = await request(app.server).put('/users').set('Authorization', `${token}`).send({
			name: 'John Doe2'
		})
		expect(response.statusCode).toEqual(204)
	})

	it('should be able to send email to reset password', async () => {
		await createAndAuthenticateUser(app)
		const response = await request(app.server).post('/users/password').send({
			credential: 'email@example.com'
		})
		expect(response.statusCode).toEqual(200)
	})

	it('should be able to desactive a user', async () => {
		const { token, userId } = await createAndAuthenticateUser(app)
		const response = await request(app.server).patch(`/users/${userId}`).set('Authorization', `${token}`)

		expect(response.statusCode).toEqual(204)
	})

	it('should be able to delete account', async () => {
		const { token } = await createAndAuthenticateUser(app)
		const response = await request(app.server).delete('/users').set('Authorization', `${token}`)

		expect(response.statusCode).toEqual(204)
	})
})
