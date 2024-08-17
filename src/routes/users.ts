import { env } from '../env'
import jwt from 'jsonwebtoken'

import fs from 'node:fs'
import util from 'node:util'
import { pipeline } from 'node:stream'

import { FastifyInstance } from 'fastify'
import { put } from '@vercel/blob'

import { prisma } from '../lib/prisma'

import { hash, compare } from 'bcrypt'

import { checkSessionIdExists } from '../middlewares/auth-token'
import {
	createLoginSchemaBody,
	createUserSchemaBody,
	getTokenHeaderSchema,
	getUserCredentialSchema,
	getUserParamsSchema,
	updateUserSchemaBody
} from '../@types/zod/user'

export async function usersRoutes(app: FastifyInstance) {
	app.post('/', async (request, reply) => {
		const { name, username, email, password, phone } = createUserSchemaBody.parse(request.body)

		const userExists = await prisma.users.findFirst({
			where: {
				OR: [{ email }, { username }]
			}
		})

		if (userExists) {
			return reply.status(400).send({ error: 'User already exists!' })
		}
		const hashedPassword = await hash(password, 6)

		await prisma.users.create({
			data: {
				name,
				username,
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
			await request.jwtVerify()

			const { userId: id } = getTokenHeaderSchema.parse(request.headers)

			const { name, username, password, phone } = updateUserSchemaBody.parse(request.body)

			const hashedPassword = await hash(password, 6)

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

		const isValidPassword = await compare(password, user.password)

		if (!isValidPassword) {
			return reply.status(403).send('Invalid credentials or password')
		}

		const token = jwt.sign({ userId: user.id }, env.JWT_SECRET_KEY, { expiresIn: '7d' })

		reply.header('Authorization', `${token}`)

		return reply
			.status(200)
			.send({ token, user: { email: user.email, id: user.id, name: user.name, avatar: user.avatar } })
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
			const { userId: id } = getTokenHeaderSchema.parse(request.headers)
			const part = await request.file()

			if (!part) {
				return reply.status(400).send({ error: 'No file uploaded' })
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

			try {
				const { url } = await put(filePath, 'blob', {
					access: 'public',
					token: env.BLOB_READ_WRITE_TOKEN
				})

				await prisma.users.update({
					where: { id },
					data: { avatar: filePath }
				})

				reply.status(200).send({ url })
			} catch (error) {
				console.error('Error uploading file:', error)
				reply.status(500).send({ error: 'Failed to upload file' })
			}
		}
	)

	app.delete(
		'/',
		{
			preHandler: [checkSessionIdExists]
		},
		async (request, reply) => {
			const { userId: id } = getTokenHeaderSchema.parse(request.headers)

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
			const { userId: id } = getTokenHeaderSchema.parse(request.headers)

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
		const { credential } = getUserCredentialSchema.parse(request.body)

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
