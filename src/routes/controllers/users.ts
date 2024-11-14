import type { ZodTypeProvider } from 'fastify-type-provider-zod'

import { FastifyInstance } from 'fastify'

import { compare } from 'bcrypt'

import { checkSessionIdExists } from '../../middlewares/auth-token'

import {
	createLoginSchemaBody,
	createUserSchemaBody,
	getRefreshTokenSchema,
	getTokenHeaderSchema,
	getUserCredentialSchema,
	updateUserSchemaBody
} from '../../@types/zod/user'

import { makeRegisterUseCase } from '../../use-cases/factories/make-register-use-case'
import { UserAlreadyExistsError } from '../../use-cases/errors/user-already-exists-error'
import { BadRequestError } from '../_errors/bad-request-error'
import { makeDeleteAccountUseCase } from '../../use-cases/factories/make-delete-account-use-case'
import { makeGetUsersCourseUseCase } from '../../use-cases/factories/make-get-users-from-course'
import { prisma } from '../../lib/prisma'
import { getParamsCourseSchema } from '../../@types/zod/course'
import { makeAuthenticateUserUseCase } from '../../use-cases/factories/make-authenticate-use-case'
import { createSlug, generateCode } from '../../utils/functions'
import { sendMail } from '../../lib/nodemailer'

interface QueryParams {
	limit?: string
	page?: string
}

export async function usersRoutes(app: FastifyInstance) {
	app.withTypeProvider<ZodTypeProvider>().post('/', async (request, reply) => {
		const { name, email, password, phone } = createUserSchemaBody.parse(
			request.body
		)
		try {
			const registerUseCase = makeRegisterUseCase()

			const { user } = await registerUseCase.execute({
				name,
				phone,
				username: createSlug(name),
				email,
				password
			})

			const code = generateCode()

			await sendMail(
				email,
				'Confirme seu cadastro conosco',
				`Aqui está seu código de confirmação: ${code}`
			)

			await prisma.validationCode.create({
				data: {
					userId: user.id,
					code,
					expiresAt: new Date(Date.now() + 1000 * 60 * 5)
				}
			})

			return reply
				.status(201)
				.send({ userId: user.id, message: 'User created successfully.' })
		} catch (error) {
			if (error instanceof UserAlreadyExistsError) {
				return reply.status(409).send({ message: error.message })
			}

			throw error
		}
	})

	app.withTypeProvider<ZodTypeProvider>().put(
		'/',
		{
			preHandler: [checkSessionIdExists]
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

	app
		.withTypeProvider<ZodTypeProvider>()
		.post('/login', async (request, reply) => {
			const { credential, password } = createLoginSchemaBody.parse(request.body)

			const authUser = makeAuthenticateUserUseCase()

			const { user } = await authUser.execute({ credential, password })

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
				.setCookie('refreshToken', String(refreshToken), {
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
		})

	app
		.withTypeProvider<ZodTypeProvider>()
		.patch('/token/refresh', async (request, reply) => {
			const { refreshToken } = getRefreshTokenSchema.parse(request.body)

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
					.setCookie('refreshToken', String(newRefreshToken), {
						path: '/',
						secure: true,
						httpOnly: true,
						sameSite: true
					})
					.status(200)
					.send({ token, refreshToken: newRefreshToken })
			}
		})

	app.withTypeProvider<ZodTypeProvider>().get<{ Querystring: QueryParams }>(
		'/:courseId',
		{
			preHandler: [checkSessionIdExists]
		},
		async (request, reply) => {
			const { courseId } = getParamsCourseSchema.parse(request.params)
			const take = parseInt(request.query.limit || '10', 10)
			const page = parseInt(request.query.page || '1', 10)
			const skip = (page - 1) * take

			const listUsers = makeGetUsersCourseUseCase()

			const students = await listUsers.execute({ courseId, take, skip })

			return reply.status(200).send(students)
		}
	)

	app.withTypeProvider<ZodTypeProvider>().delete(
		'/',
		{
			preHandler: [checkSessionIdExists]
		},
		async (request, reply) => {
			const { userId } = getTokenHeaderSchema.parse(request.headers)
			const deleteUseCase = makeDeleteAccountUseCase()
			deleteUseCase.execute({ userId })
			reply.status(204).send()
		}
	)

	app
		.withTypeProvider<ZodTypeProvider>()
		.post('/password', async (request, reply) => {
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

			await sendMail(
				credential,
				'Confirme seu cadastro conosco',
				`Aqui está seu código de confirmação: ${generateCode()}`
			)

			reply.status(200).send({ user })
		})
}
