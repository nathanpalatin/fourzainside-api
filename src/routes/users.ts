import { FastifyInstance } from 'fastify'
import { knex } from '../database'

import { randomUUID } from 'node:crypto'
import bcrypt from 'bcrypt'
import { z } from 'zod'

import util from 'node:util'
import { pipeline } from 'node:stream'
import fs from 'node:fs'

export async function usersRoutes(app: FastifyInstance) {
	app.post('/', async (request, reply) => {
		const createUserSchemaBody = z.object({
			name: z.string(),
			username: z.string(),
			avatar: z.string(),
			password: z.string(),
			email: z.string(),
			phone: z.string()
		})

		const { name, username, avatar, email, password, phone } = createUserSchemaBody.parse(request.body)

		let sessionId = request.cookies.sessionId

		if (!sessionId) {
			sessionId = randomUUID()

			reply.cookie('sessionId', sessionId, {
				path: '/',
				maxAge: 60 * 60 * 24 * 7 // 7 days
			})
		}

		const hashedPassword = await bcrypt.hash(password, 10)

		await knex('Users').insert({
			id: randomUUID(),
			name,
			username,
			createdAt: new Date(),
			updatedAt: new Date(),
			password: hashedPassword,
			avatar,
			email,
			phone
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

		const user = await knex('Users')
			.where({
				email: credential
			})
			.orWhere({
				username: credential
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

	app.post('/upload', async function (req, reply) {
		try {
			const parts = req.files()
			const pump = util.promisify(pipeline)
			const uploadedFiles = []

			for await (const part of parts) {
				const filename = part.filename
				const filePath = `./uploads/${filename}`

				await pump(part.file, fs.createWriteStream(filePath))

				uploadedFiles.push(filePath)
			}

			return reply.status(200).send(uploadedFiles)
		} catch (err) {
			console.error('Erro durante o upload:', err)
			return reply.status(500).send('Erro durante o upload.')
		}
	})

	app.get('/', async () => {
		const users = await knex('Users').select()
		return { users }
	})
}
