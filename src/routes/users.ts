import { FastifyInstance } from 'fastify'
import { knex } from '../database'
import { env } from '../env'

import { prisma } from '../lib/prisma'

import { z } from 'zod'

import fs from 'node:fs'
import util from 'node:util'
import { pipeline } from 'node:stream'

import { randomUUID } from 'node:crypto'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

import { checkSessionIdExists } from '../middlewares/auth-token'

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

		/* 		await prisma.users.create({
			data: {
				id: randomUUID(),
				name,
				username,
				createdAt: new Date(),
				updatedAt: new Date(),
				password: hashedPassword,
				email,
				phone
			}
		})
 */
		await knex('users')
			.insert({
				id: randomUUID(),
				name,
				username,
				createdAt: new Date(),
				updatedAt: new Date(),
				password: hashedPassword,
				email,
				phone
			})
			.returning('*')

		return reply.status(201).send({ message: 'User created successfully.' })
	})

	app.put(
		'/',
		{
			preHandler: [checkSessionIdExists]
		},
		async (request, reply) => {
			const updateUserSchemaBody = z.object({
				name: z.string(),
				username: z.string(),
				password: z.string(),
				phone: z.string()
			})

			const { name, username, password, phone } = updateUserSchemaBody.parse(request.body)

			const hashedPassword = await bcrypt.hash(password, 10)

			await knex('users').update({
				name,
				username,
				updatedAt: new Date(),
				password: hashedPassword,
				phone
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

		/* 	const user = await prisma.users.findFirst({
			where: {
				OR: [{ email: credential }, { username: credential }]
			}
		}) */

		const user = await knex('users')
			.select('id', 'username', 'avatar', 'intId', 'name', 'email', 'phone', 'password')
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

		const token = jwt.sign({ userId: user.id }, env.JWT_SECRET_KEY, { expiresIn: '7d' })

		reply.header('Authorization', `${token}`)

		return { token, user: { email: user.email, id: user.id, name: user.name, avatar: user.avatar } }
	})

	app.get(
		'/',
		{
			preHandler: [checkSessionIdExists]
		},
		async (_request, reply) => {
			const users = await knex('users').select('username', 'avatar', 'name', 'id', 'intId')
			return reply.status(200).send({ users })
		}
	)

	app.patch(
		'/avatar',
		{
			preHandler: [checkSessionIdExists]
		},
		async (request, reply) => {
			const userSchemaBody = z.object({
				authorization: z.string()
			})

			const { authorization: id } = userSchemaBody.parse(request.headers)
			const part = await request.file()

			if (!part) {
				reply.status(400).send({ error: 'No file uploaded' })
				return
			}

			const timestamp = new Date().getTime()
			const extension = part.filename.split('.').pop()
			const newFilename = `${timestamp}.${extension}`
			const folder = `uploads/users/avatar/${id}`
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

			reply.status(200).send({ source: filePath })
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
