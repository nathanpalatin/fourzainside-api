import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { FastifyInstance } from 'fastify'

import { prisma } from '../../lib/prisma'

import { compare } from 'bcrypt'

import { checkSessionIdExists } from '../../middlewares/auth-token'
import {
	createLoginSchemaBody,
	createUserSchemaBody,
	getRefreshTokenSchema,
	getTokenHeaderSchema,
	getUserCredentialSchema,
	getUserParamsSchema,
	updateUserSchemaBody
} from '../../@types/zod/user'

import { makeRegisterUseCase } from '../../use-cases/factories/make-register-use-case'
import { UserAlreadyExistsError } from '../../use-cases/errors/user-already-exists-error'
import { BadRequestError } from '../_errors/bad-request-error'

interface QueryParams {
	limit?: string
	page?: string
}

export async function usersRoutes(app: FastifyInstance) {
	app.withTypeProvider<ZodTypeProvider>().post(
		'/',
		{
			schema: {
				tags: ['Authentication'],
				summary: 'Create new user',
				body: createUserSchemaBody,
				response: {
					201: z.object({
						message: z.string()
					})
				}
			}
		},
		async (request, reply) => {
			const { name, email, password, phone, cpf, birthdate } =
				createUserSchemaBody.parse(request.body)
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
			} catch (error) {
				if (error instanceof UserAlreadyExistsError) {
					return reply.status(409).send({ message: error.message })
				}

				throw error
			}
			return reply.status(201).send({ message: 'User created successfully.' })
		}
	)

	app.withTypeProvider<ZodTypeProvider>().put(
		'/',
		{
			preHandler: [checkSessionIdExists],
			schema: {
				tags: ['Authentication'],
				summary: 'Update info user',
				body: updateUserSchemaBody
			}
		},
		async (request, reply) => {
			const { userId: id } = getTokenHeaderSchema.parse(request.headers)

			const { name, phone } = updateUserSchemaBody.parse(request.body)

			try {
				await prisma.users.update({
					where: {
						id
					},
					data: {
						name,
						updatedAt: new Date(),
						phone
					}
				})
			} catch (error) {
				throw new BadRequestError('Internal server error.')
			}

			return reply.status(204).send({ message: 'User updated successfully!' })
		}
	)

	app.withTypeProvider<ZodTypeProvider>().post(
		'/login',
		{
			schema: {
				tags: ['Authentication'],
				summary: 'Authenticate user',
				body: createLoginSchemaBody,
				response: {
					200: z.object({
						token: z.string(),
						refreshToken: z.string(),
						user: z.object({
							role: z.string(),
							id: z.string(),
							name: z.string(),
							avatar: z.string().nullable()
						})
					})
				}
			}
		},
		async (request, reply) => {
			const { credential, password } = createLoginSchemaBody.parse(request.body)

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

			const token = await reply.jwtSign(
				{ userId: user.id, role: user.role },
				{ expiresIn: '1h' }
			)

			const refreshToken = await reply.jwtSign(
				{ userId: user.id, role: user.role },
				{ expiresIn: '7d' }
			)

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
						id: user.id,
						name: user.name,
						avatar: user.avatar
					}
				})
		}
	)

	app.withTypeProvider<ZodTypeProvider>().patch(
		'/token/refresh',
		{
			schema: {
				tags: ['Authentication'],
				summary: 'Refresh token',
				response: {
					200: z.object({
						token: z.string(),
						refreshToken: z.string()
					})
				}
			}
		},
		async (request, reply) => {
			const { refreshToken } = getRefreshTokenSchema.parse(request.cookies)

			if (!refreshToken) {
				throw new BadRequestError('Refresh token not found.')
			}
			try {
				const decoded = (await app.jwt.verify(refreshToken)) as {
					userId: string
					role: string
				}

				const token = await reply.jwtSign(
					{ userId: decoded.userId, role: decoded.role },
					{ expiresIn: '1h' }
				)

				return reply.status(200).send({ token, refreshToken })
			} catch (error) {
				const decoded = (await app.jwt.verify(refreshToken)) as {
					userId: string
					role: string
				}

				const newRefreshToken = await reply.jwtSign(
					{ userId: decoded.userId, role: decoded.role },
					{ expiresIn: '7d' }
				)

				const token = await reply.jwtSign(
					{ userId: decoded.userId, role: decoded.role },
					{ expiresIn: '1h' }
				)

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
		}
	)

	app.withTypeProvider<ZodTypeProvider>().get<{ Querystring: QueryParams }>(
		'/',
		{
			preHandler: [checkSessionIdExists],
			schema: {
				tags: ['Users'],
				summary: 'List all users',
				response: {
					200: z.object({
						users: z.array(
							z.object({
								id: z.string(),
								name: z.string(),
								avatar: z.string().nullable()
							})
						)
					})
				}
			}
		},
		async (request, reply) => {
			const limit = parseInt(request.query.limit || '10', 10)
			const page = parseInt(request.query.page || '1', 10)
			const offset = (page - 1) * limit

			const users = await prisma.users.findMany({
				orderBy: {
					name: 'desc'
				},
				select: {
					id: true,
					name: true,
					avatar: true
				},
				take: limit,
				skip: offset
			})

			if (!users) {
				throw new BadRequestError('No users found.')
			}

			return reply.status(200).send({ users })
		}
	)

	app.withTypeProvider<ZodTypeProvider>().delete(
		'/',
		{
			preHandler: [checkSessionIdExists],
			schema: {
				tags: ['Users'],
				summary: 'Delete account',
				response: {
					204: z.object({})
				}
			}
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

			reply.status(204).send({ message: 'Account deleted successfully.' })
		}
	)

	app.withTypeProvider<ZodTypeProvider>().get(
		'/:query',
		{
			preHandler: [checkSessionIdExists],
			schema: {
				tags: ['Users'],
				summary: 'Search user by name',
				params: z.object({
					query: z.string()
				}),
				response: {
					200: z.object({
						user: z.object({
							id: z.string(),
							name: z.string(),
							avatar: z.string().nullable()
						})
					})
				}
			}
		},
		async (request, reply) => {
			const { query } = getUserParamsSchema.parse(request.params)

			const user = await prisma.users.findFirst({
				orderBy: {
					name: 'desc'
				},
				where: {
					name: {
						contains: query,
						mode: 'insensitive'
					}
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

	app.withTypeProvider<ZodTypeProvider>().post(
		'/password',
		{
			schema: {
				tags: ['Authentication'],
				summary: 'Change password',
				body: z.object({
					credential: z.string()
				})
			}
		},
		async (request, reply) => {
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
		}
	)

	app.withTypeProvider<ZodTypeProvider>().get(
		'/profile',
		{
			preHandler: [checkSessionIdExists],
			schema: {
				tags: ['Users'],
				summary: 'Get authenticated user profile',
				response: {
					200: z.object({
						user: z.object({
							id: z.string().uuid(),
							role: z.enum(['ADMIN', 'USER', 'SELLER']),
							name: z.string(),
							avatar: z.string().url().nullable()
						})
					})
				}
			}
		},
		async (request, reply) => {
			const { userId: id } = getTokenHeaderSchema.parse(request.headers)

			const user = await prisma.users.findUnique({
				where: {
					id
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
		}
	)
}
