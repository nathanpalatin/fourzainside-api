import type { FastifyInstance } from 'fastify'

import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { checkSessionIdExists } from '../../middlewares/auth-token'
import { getTokenHeaderSchema } from '../../@types/zod/user'

import {
	createNotificationSchema,
	updateNotificationSchema
} from '../../@types/zod/notification'

import { makeCreateNotificationUseCase } from '../../use-cases/factories/make-create-notification-use-case'
import { makeUpdateNotificationUseCase } from '../../use-cases/factories/make-update-notification-use-case'
import { makeGetNotificationsUseCase } from '../../use-cases/factories/make-get-notifications-use-case'
import { BadRequestError } from '../_errors/bad-request-error'

export async function notifcationsRoutes(app: FastifyInstance) {
	app.withTypeProvider<ZodTypeProvider>().get(
		'/',
		{
			preHandler: [checkSessionIdExists]
		},
		async (request, reply) => {
			const { userId } = getTokenHeaderSchema.parse(request.headers)

			try {
				const notificationsList = makeGetNotificationsUseCase()

				const { notifications } = await notificationsList.execute({ userId })

				return reply.status(200).send({ notifications })
			} catch (error) {
				if (error instanceof BadRequestError) {
					return reply.status(400).send({ message: error.message })
				}

				throw error
			}
		}
	)

	app.withTypeProvider<ZodTypeProvider>().post(
		'/',
		{
			preHandler: [checkSessionIdExists]
		},
		async (request, reply) => {
			const { userId: sendUserId } = getTokenHeaderSchema.parse(request.headers)

			const { notificationType, userId, notificationText } =
				createNotificationSchema.parse(request.body)

			try {
				const createNotification = makeCreateNotificationUseCase()

				const { notification } = await createNotification.execute({
					notificationType: notificationType,
					notificationText: notificationText ?? '',
					sendUserId,
					userId
				})

				return reply.status(201).send({
					id: notification.id,
					message: 'Notification sent successfully.'
				})
			} catch (error) {
				if (error instanceof BadRequestError) {
					return reply.status(400).send({ message: error.message })
				}
				throw error
			}
		}
	)

	app.withTypeProvider<ZodTypeProvider>().patch(
		'/:id',
		{
			preHandler: [checkSessionIdExists]
		},
		async (request, reply) => {
			const { id } = updateNotificationSchema.parse(request.params)

			try {
				const updateNotification = makeUpdateNotificationUseCase()
				await updateNotification.execute({ id })

				reply.status(204).send()
			} catch (error) {
				if (error instanceof BadRequestError) {
					return reply.status(400).send({ message: error.message })
				}
				throw error
			}
		}
	)
}
