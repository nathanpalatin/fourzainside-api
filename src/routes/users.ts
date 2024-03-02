import { FastifyInstance } from 'fastify'
import { knex } from '../database'

import { randomUUID } from 'node:crypto'
import bcrypt from 'bcrypt'
import { z } from 'zod'

export async function usersRoutes(app: FastifyInstance) {
	app.post('/', async (request, reply) => {
		const createUserSchemaBody = z.object({
			name: z.string(),
			nickname: z.string(),
			avatar: z.string(),
			password: z.string(),
			email: z.string(),
			cpf: z.string()
		})

		const { name, nickname, avatar, email, cpf, password } = createUserSchemaBody.parse(request.body)

		let sessionId = request.cookies.sessionId

		if (!sessionId) {
			sessionId = randomUUID()

			reply.cookie('sessionId', sessionId, {
				path: '/',
				maxAge: 60 * 60 * 24 * 7 // 7 days
			})
		}

		const hashedPassword = await bcrypt.hash(password, 10)

		await knex('users').insert({
			id: randomUUID(),
			name,
			nickname,
			password: hashedPassword,
			avatar,
			email,
			cpf
		})

		return reply.status(201).send('User created successfully!')
	})

	app.post('/login', async (request, reply) => {
		const createLoginSchemaBody = z.object({
			credential: z.string(),
			password: z.string()
		})

		const { credential, password } = createLoginSchemaBody.parse(request.body)

		if (!credential || !password) {
			return reply.status(500).send('Invalid credentials or password')
		}

		const user = await knex('users')
			.where({
				email: credential
			})
			.orWhere({
				nickname: credential
			})
			.first()

		if (!user) {
			return reply.status(404).send('User not found')
		}

		const isValidPassword = await bcrypt.compare(password, user.password)

		if (!isValidPassword) {
			return reply.status(403).send('Invalid credentials or password')
		}

		return reply.status(200).send('Login successful')
	})
}
