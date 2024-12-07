import type { FastifyInstance } from 'fastify'
import { checkSessionIdExists } from '../../middlewares/auth-token'

import type { ZodTypeProvider } from 'fastify-type-provider-zod'

import { getTokenHeaderSchema } from '../../@types/zod/user'

import { makeGetUserProfileUseCase } from '../../use-cases/factories/make-get-user-profile-use-case'
import { makeGetEnsginsUserUseCase } from '../../use-cases/factories/make-get-ensign-user-use-case'
import { ResourceNotFoundError } from '../../use-cases/errors/resource-not-found-error'

export async function profileRoutes(app: FastifyInstance) {
	app.withTypeProvider<ZodTypeProvider>().get(
		'/',
		{
			preHandler: [checkSessionIdExists]
		},
		async (request, reply) => {
			const { userId } = getTokenHeaderSchema.parse(request.headers)

			try {
				const getUserProfile = makeGetUserProfileUseCase()
				const { user } = await getUserProfile.execute({ userId })
				return reply.status(200).send({ user })
			} catch (error) {
				if (error instanceof ResourceNotFoundError) {
					return reply.status(404).send({ message: 'User not found.' })
				}

				throw error
			}
		}
	)
	app.withTypeProvider<ZodTypeProvider>().get(
		'/ensigns',
		{
			preHandler: [checkSessionIdExists]
		},
		async (request, reply) => {
			const { userId } = getTokenHeaderSchema.parse(request.headers)

			try {
				const getUserProfile = makeGetEnsginsUserUseCase()

				const { ensigns } = await getUserProfile.execute({ userId })
				return reply.status(200).send({ ensigns })
			} catch (error) {
				if (error instanceof ResourceNotFoundError) {
					return reply.status(400).send({ message: error.message })
				}

				throw error
			}
		}
	)
}
