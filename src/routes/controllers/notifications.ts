import type { FastifyInstance } from 'fastify'

import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { checkSessionIdExists } from '../../middlewares/auth-token'
import { getTokenHeaderSchema } from '../../@types/zod/user'

import {
	createNotificationSchema,
	createNotificationsSchema,
	updateNotificationSchema
} from '../../@types/zod/notification'

import { makeCreateNotificationUseCase } from '../../use-cases/factories/make-create-notification-use-case'
import { makeUpdateNotificationUseCase } from '../../use-cases/factories/make-update-notification-use-case'
import { makeGetNotificationsUseCase } from '../../use-cases/factories/make-get-notifications-use-case'

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
			const { userId } = getTokenHeaderSchema.parse(request.headers)

			const notificationsList = makeGetNotificationsUseCase()

			const { notifications } = await notificationsList.execute({ userId })

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
			const { userId: sendUserId } = getTokenHeaderSchema.parse(request.headers)

			const { notificationType, receiveUserId, notificationText } =
				createNotificationSchema.parse(request.body)

			const createNotification = makeCreateNotificationUseCase()

			const { notification } = await createNotification.execute({
				notificationType: notificationType,
				notificationText: notificationText ?? '',
				sendUserId,
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
