import type { ZodTypeProvider } from 'fastify-type-provider-zod'

import { FastifyInstance } from 'fastify'

import { compare, hash } from 'bcrypt'

import { checkSessionIdExists } from '../../middlewares/auth-token'

import {
	bodyUserPasswordSchema,
	createLoginSchemaBody,
	createUserSchemaBody,
	getRefreshTokenSchema,
	getTokenHeaderSchema,
	getUserCredentialPasswordSchema,
	getUserCredentialSchema,
	getUserCredentialValidadeSchema,
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
import { InvalidCredentialsError } from '../../use-cases/errors/invalid-credentials-error'
import { UnauthorizedError } from '../_errors/unauthorized-error'

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

			const codeGenerated = generateCode()

			await prisma.validationCode.create({
				data: {
					code: codeGenerated,
					email
				}
			})

			await sendMail(
				email,
				'[BOAS VINDAS] Bem vindo a nossa plataforma',
				`Acesse o link para confirmar sua conta: <h1 style={{ fontSize: '26px' }}>${codeGenerated}</h1>`
			)

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
			try {
				const authUser = makeAuthenticateUserUseCase()

				const { user } = await authUser.execute({ credential, password })

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
			} catch (error) {
				if (error instanceof InvalidCredentialsError) {
					return reply.status(401).send({ message: error.message })
				}

				if (error instanceof UnauthorizedError) {
					return reply.status(401).send({ message: error.message })
				}

				throw error
			}
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
				}
			})

			if (!user) {
				throw new BadRequestError('User not found.')
			}

			const reset = await prisma.resetPassword.create({
				data: {
					email: user.email
				}
			})

			await sendMail(
				credential,
				'[CONTA] Redefinir sua senha',
				`Acesse o link para redefinição da sua senha: <a href="http://localhost:3000/auth/reset-password/${reset.token}">Cliquei aqui</a>`
			)

			reply.status(204).send()
		})

	app.withTypeProvider<ZodTypeProvider>().patch(
		'/change-password',
		{
			preHandler: [checkSessionIdExists]
		},
		async (request, reply) => {
			const { userId } = getTokenHeaderSchema.parse(request.headers)
			const { password, newPassword } = bodyUserPasswordSchema.parse(
				request.body
			)

			const user = await prisma.users.findFirst({
				where: {
					id: userId
				}
			})
			if (!user) {
				throw new BadRequestError('User not found.')
			}

			const isValidPassword = await compare(password, user?.password)

			if (!isValidPassword) {
				throw new BadRequestError('Actual password not matched.')
			}

			await prisma.users.update({
				where: { id: userId },
				data: {
					password: await hash(newPassword, 6)
				}
			})

			await sendMail(
				user.email,
				'[CONTA] Sua senha foi alterada',
				`Sua senha foi alterada recentemente, se não foi você que fez essa ação, por favor, entre em contato imediatamente com nosso suporte.`
			)

			reply.status(204).send()
		}
	)

	app
		.withTypeProvider<ZodTypeProvider>()
		.post('/reset-password', async (request, reply) => {
			const { credential, password } = getUserCredentialPasswordSchema.parse(
				request.body
			)

			const user = await prisma.resetPassword.findFirst({
				where: {
					token: credential
				}
			})

			if (!user) {
				throw new BadRequestError('User not found.')
			}

			await prisma.users.update({
				where: {
					email: user.email
				},
				data: {
					password: await hash(password, 6)
				}
			})

			await sendMail(
				user.email,
				'[CONTA] Sua senha foi alterada',
				`Sua senha foi alterada recentemente, se não foi você que fez essa ação, por favor, entre em contato imediatamente com nosso suporte.`
			)

			await prisma.resetPassword.delete({
				where: {
					token: credential
				}
			})

			reply.status(204).send()
		})

	app
		.withTypeProvider<ZodTypeProvider>()
		.post('/validate-account', async (request, reply) => {
			const { email, code } = getUserCredentialValidadeSchema.parse(
				request.body
			)

			const user = await prisma.validationCode.findFirst({
				where: {
					email,
					code
				}
			})

			if (!user) {
				throw new BadRequestError('Código inválido.')
			}

			await prisma.users.update({
				where: {
					email: user.email
				},
				data: {
					emailVerified: true
				}
			})

			await sendMail(
				user.email,
				'[BOAS VINDAS] Sua conta foi confirmada!',
				`Agora voce pode desfrutar de todos os nossos recursos da plataforma, seja bem-vindo(a)!.`
			)

			await prisma.validationCode.delete({
				where: {
					id: user.id
				}
			})

			reply.status(200).send({ message: 'Account confirmation successfully.' })
		})
}
