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
import { registerUseCase } from '../use-cases/register'

export async function usersRoutes(app: FastifyInstance) {
	app.post('/', async (request, reply) => {
		const { name, username, email, password, phone } = createUserSchemaBody.parse(request.body)
		try {
			await registerUseCase({
				name,
				username,
				email,
				phone,
				password
			})
		} catch (error) {
			return reply.status(409).send({ error })
		}

		return reply.status(201).send({ message: 'User created successfully.' })
	})

	app.put(
		'/',
		{
			preHandler: [checkSessionIdExists]
		},
		async (request, reply) => {
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

		const token = jwt.sign({ userId: user.id }, env.JWT_SECRET_KEY, { expiresIn: '30m' })
		const refreshToken = jwt.sign({ userId: user.id }, env.JWT_SECRET_KEY, { expiresIn: '7d' })

		return reply
			.setCookie('refreshToken', refreshToken, {
				path: '/',
				secure: true,
				httpOnly: true,
				sameSite: true
			})
			.status(200)
			.send({
				token,
				refreshToken,
				user: { username: user.username, email: user.email, id: user.id, name: user.name, avatar: user.avatar }
			})
	})

	app.patch('/token/refresh', async (request, reply) => {
		await request.jwtVerify({ onlyCookie: true })

		const token = await reply.jwtSign(
			{},
			{
				sign: {
					sub: request.user.sub
				}
			}
		)

		const refreshToken = await reply.jwtSign(
			{},
			{
				sign: {
					sub: request.user.sub,
					expiresIn: '7d'
				}
			}
		)

		return reply
			.setCookie('refreshToken', refreshToken, {
				path: '/',
				secure: true,
				httpOnly: true,
				sameSite: true
			})
			.status(200)
			.send({ token, refreshToken })
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

			if (!part || part.mimetype !== 'image/png') {
				return reply.status(400).send({ error: 'No file found' })
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

			const { url } = await put(filePath, 'blob', {
				access: 'public',
				token: env.BLOB_READ_WRITE_TOKEN
			})

			await prisma.users.update({
				where: { id },
				data: { avatar: filePath }
			})

			return reply.status(200).send({ url })
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

			return reply.status(204).send({ message: 'All users has been deleted successfully.' })
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

			reply.status(204).send({ message: 'User has been deleted successfully.' })
		}
	)

	app.get(
		'/:username',
		{
			preHandler: [checkSessionIdExists]
		},
		async (request, reply) => {
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

			return reply.status(200).send({ user })
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
