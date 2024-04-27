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
			password: z.string(),
			email: z.string(),
			phone: z.string()
		})

		const { name, username, email, password, phone } = createUserSchemaBody.parse(request.body)

		const hashedPassword = await bcrypt.hash(password, 10)

		const token = randomUUID()

		const [user] = await knex('users').insert({
			id: token,
			name,
			username,
			createdAt: new Date(),
			updatedAt: new Date(),
			password: hashedPassword,
			email,
			phone
		}).returning('*')

		reply.cookie('token', token, {
			path: '/',
			maxAge: 60 * 60 * 24 * 7 // 7 days
		})

		return { token, user }
	})

	app.put(
		'/:id',
		{
			preHandler: [checkSessionIdExists]
		},
		async (request, reply) => {
			const getUserParamsSchema = z.object({
				token: z.string().uuid()
			})

			const { token: id } = getUserParamsSchema.parse(request.cookies)

			const updateUserSchemaBody = z.object({
				name: z.string(),
				username: z.string(),
				password: z.string(),
				email: z.string(),
				phone: z.string()
			})

			const { name, username, email, password, phone } = updateUserSchemaBody.parse(request.body)

			const hashedPassword = await bcrypt.hash(password, 10)

			await knex('users')
				.update({
					name,
					username,
					updatedAt: new Date(),
					password: hashedPassword,
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

		const user = await knex('users')
			.select('id', 'username', 'avatar', 'intId', 'name', 'email', 'password')
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

		let token = request.cookies.token

		if (!token) {
			token = randomUUID()

			reply.cookie('token', token, {
				path: '/',
				maxAge: 60 * 60 * 24 * 7 // 7 days
			})
		}

		return { token, user }
	})

	app.get(
		'/',
		{
			preHandler: [checkSessionIdExists]
		},
		async () => {
			const users = await knex('users').select('username', 'avatar', 'name', 'id', 'intId')
			return { users }
		}
	)

	app.patch('/avatar', async (request, reply) => {
		const userSchemaBody = z.object({
			token: z.string().uuid()
		})

		const { token: id } = userSchemaBody.parse(request.cookies)

		const part = await request.file()

		if (!part) {
			reply.status(400).send({ error: 'No file uploaded' })
			return
		}

		const timestamp = new Date().getTime()
		const extension = part.filename.split('.').pop()
		const newFilename = `${timestamp}.${extension}`
		const folder = `uploads/users/${id}`
		const filePath = `${folder}/${newFilename}`

		if (!fs.existsSync(folder)) {
			fs.mkdirSync(folder, { recursive: true })
		}

		await util.promisify(pipeline)(part.file, fs.createWriteStream(filePath))

		await knex('users')
			.update({
				avatar: filePath
			})
			.where({
				id
			})

		reply.status(201).send({ id, source: filePath })
	})

	app.delete(
		'/',
		{
			preHandler: [checkSessionIdExists]
		},
		async (request, reply) => {
			const getUserParamsSchema = z.object({
				token: z.string().uuid()
			})

			const { token: id } = getUserParamsSchema.parse(request.cookies)

			await knex('users').delete().where({ id })

			reply.status(204)
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

			const user = await knex('users')
				.select('username', 'email', 'avatar', 'phone', 'name')
				.where({ username })
				.first()

			return { user }
		}
	)

	app.post('/password', async (request, reply) => {
		const getUserParamsSchema = z.object({
			credential: z.string()
		})

		const { credential } = getUserParamsSchema.parse(request.body)

		const user = await knex('users')
			.select('email')
			.where({
				username: credential
			})
			.orWhere({
				email: credential
			})

		// FAZER INTEGRACAO DE API PARA ENVIO DE E-MAIL PARA REDEFINIÇÃO DE SENHA
		reply.status(200).send({ user })
	})
}
