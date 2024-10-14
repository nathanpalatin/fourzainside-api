import { env } from '../env'

import fs from 'node:fs'
import util from 'node:util'
import { pipeline } from 'node:stream'

import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { FastifyInstance } from 'fastify'
import { put } from '@vercel/blob'

import { prisma } from '../lib/prisma'

import { compare } from 'bcrypt'

import { checkSessionIdExists } from '../middlewares/auth-token'
import {
	createLoginSchemaBody,
	createUserSchemaBody,
	getRefreshTokenSchema,
	getTokenHeaderSchema,
	getUserCredentialSchema,
	getUserParamsSchema,
	updateUserSchemaBody
} from '../@types/zod/user'
import { BadRequestError } from './_errors/bad-request-error'
import { makeRegisterUseCase } from '../use-cases/factories/make-register-use-case'
import { UserAlreadyExistsError } from '../use-cases/errors/user-already-exists-error'

interface QueryParams {
	limit?: string
	page?: string
}

export async function usersRoutes(app: FastifyInstance) {
	app.post('/', async (request, reply) => {
		const { name, email, password, phone, cpf, birthdate } = createUserSchemaBody.parse(request.body)
		try {
			const registerUseCase = makeRegisterUseCase()

			await registerUseCase.execute({
				name,
				cpf,
				phone,
				birthdate,
				email,
				password
			})
		} catch (err) {
			if (err instanceof UserAlreadyExistsError) {
				return reply.status(409).send({ message: err.message })
			}

			throw err
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

			const { name, phone, avatar } = updateUserSchemaBody.parse(request.body)

			try {
				await prisma.users.update({
					where: {
						id
					},
					data: {
						name,
						updatedAt: new Date(),
						phone,
						avatar
					}
				})
			} catch (error) {
				throw new BadRequestError('Internal server error.')
			}

			return reply.status(204).send('User updated successfully!')
		}
	)

	app.post('/login', async (request, reply) => {
		const { credential, password } = createLoginSchemaBody.parse(request.body)

		if (!credential || !password) {
			return reply.status(400).send({ message: 'Invalid credentials or password' })
		}

		const user = await prisma.users.findFirst({
			where: {
				OR: [{ email: credential }, { cpf: credential }]
			}
		})

		if (!user) {
			throw new BadRequestError('Invalid credentials.')
		}

		const isValidPassword = await compare(password, user.password)

		if (!isValidPassword) {
			throw new BadRequestError('Invalid password.')
		}

		const token = await reply.jwtSign({ userId: user.id, role: user.role }, { expiresIn: '1h' })

		const refreshToken = await reply.jwtSign({ userId: user.id, role: user.role }, { expiresIn: '7d' })

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
				user: {
					role: user.role,
					email: user.email,
					id: user.id,
					name: user.name,
					avatar: user.avatar
				}
			})
	})

	app.patch('/token/refresh', async (request, reply) => {
		const { refreshToken } = getRefreshTokenSchema.parse(request.cookies)

		if (!refreshToken) {
			throw new BadRequestError('Refresh token not found.')
		}
		try {
			const decoded = (await app.jwt.verify(refreshToken)) as { userId: string; role: string }

			const token = await reply.jwtSign({ userId: decoded.userId, role: decoded.role }, { expiresIn: '1h' })

			return reply.status(200).send({ token, refreshToken })
		} catch (error) {
			const decoded = (await app.jwt.verify(refreshToken)) as { userId: string; role: string }

			const newRefreshToken = await reply.jwtSign(
				{ userId: decoded.userId, role: decoded.role },
				{ expiresIn: '7d' }
			)

			const token = await reply.jwtSign({ userId: decoded.userId, role: decoded.role }, { expiresIn: '1h' })

			return reply
				.setCookie('refreshToken', newRefreshToken, {
					path: '/',
					secure: true,
					httpOnly: true,
					sameSite: true
				})
				.status(200)
				.send({ token, refreshToken: newRefreshToken })
		}
	})

	app.get<{ Querystring: QueryParams }>(
		'/',
		{
			preHandler: [checkSessionIdExists]
		},
		async (request, reply) => {
			const limit = parseInt(request.query.limit || '10', 10)
			const page = parseInt(request.query.page || '1', 10)
			const offset = (page - 1) * limit

			const users = await prisma.users.findMany({
				select: {
					id: true,
					name: true,
					avatar: true
				},
				orderBy: {
					createdAt: 'desc'
				},
				take: limit,
				skip: offset
			})

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

	app.patch(
		'/:id',
		{
			preHandler: [checkSessionIdExists]
		},
		async (request, reply) => {
			const { userId: id } = getTokenHeaderSchema.parse(request.headers)

			await prisma.users.update({
				data: {
					emailVerified: false
				},
				where: {
					id
				}
			})

			reply.status(204).send({ message: 'User has been disabled successfully.' })
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

	app.get(
		'/:name',
		{
			preHandler: [checkSessionIdExists]
		},
		async (request, reply) => {
			const { name } = getUserParamsSchema.parse(request.params)

			const user = await prisma.users.findFirst({
				where: {
					name
				},
				select: {
					id: true,
					avatar: true,
					name: true
				}
			})

			if (!user) {
				throw new BadRequestError('User not found.')
			}

			return reply.status(200).send({ user })
		}
	)

	app.post('/password', async (request, reply) => {
		const { credential } = getUserCredentialSchema.parse(request.body)

		const user = await prisma.users.findFirst({
			where: {
				email: credential
			},
			select: {
				email: true
			}
		})

		if (!user) {
			throw new BadRequestError('User not found.')
		}

		reply.status(200).send({ user })
	})

	app.withTypeProvider<ZodTypeProvider>().get(
		'/profile',
		{
			preHandler: [checkSessionIdExists],
			schema: {
				tags: ['Auth'],
				summary: 'Get authenticated user profile',
				response: {
					200: z.object({
						user: z.object({
							id: z.string().uuid(),
							role: z.enum(['ADMIN', 'USER', 'SELLER']),
							name: z.string(),
							avatar: z.string().url().nullable()
						})
					}),
					404: z.object({
						message: z.string()
					}),
					500: z.object({
						message: z.string()
					})
				}
			}
		},
		async (request, reply) => {
			try {
				const { userId } = request.headers

				const user = await prisma.users.findUnique({
					where: {
						id: String(userId)
					},
					select: {
						id: true,
						name: true,
						role: true,
						avatar: true
					}
				})

				if (!user) {
					throw new BadRequestError('User not found.')
				}

				return reply.status(200).send({ user })
			} catch (error) {
				return reply.status(500).send({ message: 'An error occurred while fetching the profile.' })
			}
		}
	)
}
