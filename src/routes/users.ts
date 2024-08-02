import { FastifyInstance } from 'fastify'
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

		const userExists = await prisma.users.findMany({
			where: {
				OR: [{ email }, { username }]
			}
		})

		if (userExists) {
			return reply.status(400).send({ error: 'User already exists!' })
		}
		const hashedPassword = await bcrypt.hash(password, 10)

		await prisma.users.create({
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
			const getUserHeaderSchema = z.object({
				userId: z.string()
			})

			const { userId: id } = getUserHeaderSchema.parse(request.headers)

			const { name, username, password, phone } = updateUserSchemaBody.parse(request.body)

			const hashedPassword = await bcrypt.hash(password, 10)

			await prisma.users.update({
				where: {
					id
				},
				data: {
					name,
					username,
					updatedAt: new Date(),
					password: hashedPassword,
					phone
				}
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

		const user = await prisma.users.findFirst({
			where: {
				OR: [{ email: credential }, { username: credential }]
			}
		})

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
			const users = await prisma.users.findMany({ select: { id: true, email: true, name: true, avatar: true } })
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
				userId: z.string()
			})

			const { userId: id } = userSchemaBody.parse(request.headers)
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

			await prisma.users.update({
				where: {
					id
				},
				data: {
					avatar: filePath
				}
			})

			reply.status(200).send({ source: filePath })
		}
	)

	app.delete(
		'/',
		{
			preHandler: [checkSessionIdExists]
		},
		async (request, reply) => {
			const getUserParamsSchema = z.object({
				userId: z.string()
			})

			const { userId: id } = getUserParamsSchema.parse(request.headers)

			await prisma.users.delete({
				where: {
					id
				}
			})

			reply.status(204).send({ message: 'User deleted successfully.' })
		}
	)

	app.delete(
		'/:id',
		{
			preHandler: [checkSessionIdExists]
		},
		async (request, reply) => {
			const getUserParamsSchema = z.object({
				id: z.string()
			})

			const { id } = getUserParamsSchema.parse(request.params)

			await prisma.users.delete({
				where: {
					id
				}
			})

			reply.status(204).send({ message: 'User deleted successfully.' })
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

			const user = await prisma.users.findFirst({
				where: {
					username
				},
				select: {
					username: true,
					avatar: true,
					phone: true,
					name: true
				}
			})

			return { user }
		}
	)

	app.post('/password', async (request, reply) => {
		const getUserParamsSchema = z.object({
			credential: z.string()
		})

		const { credential } = getUserParamsSchema.parse(request.body)

		const user = await prisma.users.findFirst({
			where: {
				OR: [{ email: credential }, { username: credential }]
			},
			select: {
				email: true
			}
		})

		reply.status(200).send({ user })
	})
}
