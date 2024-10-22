import type { FastifyInstance } from 'fastify'
import { prisma } from '../../lib/prisma'

import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { checkSessionIdExists } from '../../middlewares/auth-token'
import { getTokenHeaderSchema } from '../../@types/zod/user'

import { BadRequestError } from '../_errors/bad-request-error'
import {
	createNotificationSchema,
	createNotificationsSchema,
	updateNotificationSchema
} from '../../@types/zod/notification'

import { makeCreateNotificationUseCase } from '../../use-cases/factories/make-create-notification-use-case'
import { makeUpdateNotificationUseCase } from '../../use-cases/factories/make-update-notification-use-case'

export async function notifcationsRoutes(app: FastifyInstance) {
	app.withTypeProvider<ZodTypeProvider>().get(
		'/',
		{
			preHandler: [checkSessionIdExists],
			schema: {
				tags: ['Notifications'],

				summary: 'Get authenticated user notifications',
				response: {
					200: createNotificationsSchema
				}
			}
		},
		async (request, reply) => {
			const { userId: receiveUserId } = getTokenHeaderSchema.parse(
				request.headers
			)

			const notifications = await prisma.notifications.findMany({
				orderBy: {
					createdAt: 'desc'
				},
				where: { receiveUserId }
			})

			if (!notifications) {
				throw new BadRequestError('Notifications not found.')
			}

			return reply.status(200).send({ notifications })
		}
	)

	app.withTypeProvider<ZodTypeProvider>().post(
		'/',
		{
			preHandler: [checkSessionIdExists],
			schema: {
				tags: ['Notifications'],
				summary: 'Send a new notification',
				body: createNotificationSchema
			}
		},
		async (request, reply) => {
			const { userId } = getTokenHeaderSchema.parse(request.headers)

			const { notificationType, receiveUserId, notificationText } =
				createNotificationSchema.parse(request.body)

			const createNotification = makeCreateNotificationUseCase()

			const { notification } = await createNotification.execute({
				notificationType: notificationType,
				notificationText: notificationText ?? '',
				sendUserId: userId,
				receiveUserId
			})

			return reply.status(200).send({
				id: notification.id,
				message: 'Notification sent successfully.'
			})
		}
	)

	app.withTypeProvider<ZodTypeProvider>().patch(
		'/:id',
		{
			preHandler: [checkSessionIdExists],
			schema: {
				tags: ['Notifications'],
				summary: 'Read a notification'
			}
		},
		async (request, reply) => {
			const { id } = updateNotificationSchema.parse(request.params)

			const updateNotification = makeUpdateNotificationUseCase()
			updateNotification.execute({ id })

			reply.status(204).send()
		}
	)
}
