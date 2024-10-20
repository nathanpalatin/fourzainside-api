import type { FastifyInstance } from 'fastify'
import { checkSessionIdExists } from '../../middlewares/auth-token'

import type { ZodTypeProvider } from 'fastify-type-provider-zod'

import { getTokenHeaderSchema, userProfileSchema } from '../../@types/zod/user'

import { BadRequestError } from '../_errors/bad-request-error'
import { makeGetUserProfileUseCase } from '../../use-cases/factories/make-get-user-profile-use-case'

export async function profileRoutes(app: FastifyInstance) {
	app.withTypeProvider<ZodTypeProvider>().get(
		'/',
		{
			preHandler: [checkSessionIdExists],
			schema: {
				tags: ['Users'],
				summary: 'Get authenticated user profile',
				response: {
					200: userProfileSchema
				}
			}
		},
		async (request, reply) => {
			const getUserProfile = makeGetUserProfileUseCase()
			const { userId } = getTokenHeaderSchema.parse(request.headers)

			const { user } = await getUserProfile.execute({ userId })

			if (!user) {
				throw new BadRequestError('User not found.')
			}

			return reply.status(200).send({ user })
		}
	)
}
