import { FastifyInstance } from 'fastify'
import { knex } from '../database'

import { randomUUID } from 'node:crypto'
import bcrypt from 'bcrypt'
import { z } from 'zod'

import util from 'node:util'
import { pipeline } from 'node:stream'
import fs from 'node:fs'
import { checkSessionIdExists } from '../middlewares/check-session-id'

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

	app.put(
		'/:id',
		{
			preHandler: [checkSessionIdExists]
		},
		async (request, reply) => {
			const getUserParamsSchema = z.object({
				id: z.string().uuid()
			})

			const { id } = getUserParamsSchema.parse(request.params)

			const updateUserSchemaBody = z.object({
				name: z.string(),
				username: z.string(),
				avatar: z.string(),
				password: z.string(),
				email: z.string(),
				phone: z.string()
			})

			const { name, username, avatar, email, password, phone } = updateUserSchemaBody.parse(request.body)

			const hashedPassword = await bcrypt.hash(password, 10)

			await knex('Users')
				.update({
					name,
					username,
					updatedAt: new Date(),
					password: hashedPassword,
					avatar,
					email,
					phone
				})
				.where({
					id
				})

			return reply.status(204).send('User updated successfully!')
		}
	)

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

		let sessionId = request.cookies.sessionId

		if (!sessionId) {
			sessionId = randomUUID()

			reply.cookie('sessionId', sessionId, {
				path: '/',
				maxAge: 60 * 60 * 24 * 7 // 7 days
			})
		}

		return { user }
	})

	app.post('/upload', async function (req, reply) {
		const parts = req.files()
		const pump = util.promisify(pipeline)
		const uploadedFiles = []

		for await (const part of parts) {
			const filename = part.filename
			const folder = 'uploads/users'

			if (!fs.existsSync(folder)) {
				fs.mkdirSync(folder, { recursive: true })
			}

			const timestamp = new Date().getTime()
			const extension = filename.split('.').pop()
			const newFilename = `${timestamp}.${extension}`

			const filePath = `${folder}/${newFilename}`

			await pump(part.file, fs.createWriteStream(filePath))

			uploadedFiles.push(filePath)
		}

		return reply.status(200).send(uploadedFiles)
	})

	app.get(
		'/',
		{
			preHandler: [checkSessionIdExists]
		},
		async () => {
			const users = await knex('Users').select()
			return { users }
		}
	)

	app.delete(
		'/:id',
		{
			preHandler: [checkSessionIdExists]
		},
		async (request, reply) => {
			const getUserParamsSchema = z.object({
				id: z.string().uuid()
			})

			const { id } = getUserParamsSchema.parse(request.params)

			await knex('Users').delete().where({ id }).first()

			reply.status(204).send({ message: 'User deleted' })
		}
	)

	app.get(
		'/:username',
		{
			preHandler: [checkSessionIdExists]
		},
		async (request, _reply) => {
			const getUserParamsSchema = z.object({
				username: z.string()
			})

			const { username } = getUserParamsSchema.parse(request.params)

			const user = await knex('Users').select().where({ username }).first()

			return { user }
		}
	)

	app.post('/password', async (request, reply) => {
		const getUserParamsSchema = z.object({
			credential: z.string()
		})

		const { credential } = getUserParamsSchema.parse(request.body)

		const user = await knex('Users')
			.select('email')
			.where({
				username: credential
			})
			.orWhere({
				email: credential
			})

		// FAZER INTEGRACAO DE API PARA ENVIO DE E-MAIL PARA REDEFINIÇÃO DE SENHA

		return user
	})
}
