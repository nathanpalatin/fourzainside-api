import { prisma } from '@/lib/prisma'
import { faker } from '@faker-js/faker'
import { hash } from 'bcrypt'
import { FastifyInstance } from 'fastify'
import request from 'supertest'

export async function createAndAuthenticateUser(app: FastifyInstance) {
	const email = faker.internet.email()
	await prisma.users.create({
		data: {
			name: 'John Doe',
			cpf: faker.phone.number(),
			birthdate: '1993-06-14',
			phone: faker.phone.number(),
			email,
			password: await hash('123456', 1),
			role: 'USER'
		}
	})

	const authResponse = await request(app.server).post('/users/login').send({
		credential: email,
		password: '123456'
	})

	const {
		token,
		refreshToken,
		user: { userId, name }
	} = authResponse.body

	return {
		token,
		refreshToken,
		name,
		email,
		userId
	}
}
