import type { FastifyInstance } from 'fastify'
import { prisma } from '@/lib/prisma'

import { z } from 'zod'

import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { checkSessionIdExists } from '@/middlewares/auth-token'
import { getTokenHeaderSchema } from '@/@types/zod/user'

import { BadRequestError } from '../_errors/bad-request-error'

export async function notifcationsRoutes(app: FastifyInstance) {
	app.withTypeProvider<ZodTypeProvider>().get(
		'/',
		{
			preHandler: [checkSessionIdExists],
			schema: {
				tags: ['Notifications'],
				summary: 'Get authenticated user notifications',
				response: {
					200: z.object({
						notifications: z.array(
							z.object({
								id: z.string().uuid(),
								sendUserId: z.string(),
								receiveUserId: z.string(),
								status: z.string(),
								notificationType: z.string(),
								createdAt: z.date()
							})
						)
					})
				}
			}
		},
		async (request, reply) => {
			const { userId: receiveUserId } = getTokenHeaderSchema.parse(
				request.headers
			)

			const notifications = await prisma.notifications.findMany({
				where: { receiveUserId }
			})

			if (!notifications) {
				throw new BadRequestError('Notifications not found.')
			}

			return reply.status(200).send({ notifications })
		}
	)
}
