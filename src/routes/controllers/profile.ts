import type { FastifyInstance } from 'fastify'
import { prisma } from '../../lib/prisma'

import { z } from 'zod'

import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { checkSessionIdExists } from '../../middlewares/auth-token'
import { getTokenHeaderSchema } from '../../@types/zod/user'

import { BadRequestError } from '../_errors/bad-request-error'

export async function profileRoutes(app: FastifyInstance) {
	app.withTypeProvider<ZodTypeProvider>().get(
		'/',
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
