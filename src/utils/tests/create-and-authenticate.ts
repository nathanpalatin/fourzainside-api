import { FastifyInstance } from 'fastify'
import request from 'supertest'
import { prisma } from '../../lib/prisma'
import { hash } from 'bcrypt'
import { faker } from '@faker-js/faker'

export async function createAndAuthenticateUser(app: FastifyInstance) {
	await prisma.users.create({
		data: {
			name: faker.person.fullName(),
			email: 'email@example.com',
			avatar: faker.image.avatarGitHub(),
			phone: faker.phone.number(),
			cpf: faker.string.numeric(11),
			birthdate: faker.date.anytime(),
			password: await hash('123456', 1)
		}
	})

	const authResponse = await request(app.server).post('/users/login').send({
		credential: 'email@example.com',
		password: '123456'
	})

	const {
		token,
		user: { userId, name }
	} = authResponse.body

	return {
		token,
		name,
		userId
	}
}
