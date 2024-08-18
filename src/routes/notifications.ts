import { FastifyInstance } from 'fastify'
import { prisma } from '@/lib/prisma'

import { checkSessionIdExists } from '@/middlewares/auth-token'
import { getTokenHeaderSchema } from '@/@types/zod/user'

import { getNotificationBodySchema, getNotificationParamsSchema } from '@/@types/zod/notification'

export async function notificationsRoutes(app: FastifyInstance) {
	app.get(
		'/',
		{
			preHandler: [checkSessionIdExists]
		},
		async (request, reply) => {
			const { userId: receiveUserId } = getTokenHeaderSchema.parse(request.headers)

			const notifications = await prisma.notifications.findMany({
				where: {
					receiveUserId
				},
				select: {
					id: true,
					sendUserId: true,
					notificationType: true,
					createdAt: true,
					status: true
				}
			})

			return reply.status(200).send({ notifications })
		}
	)

	app.post(
		'/',
		{
			preHandler: [checkSessionIdExists]
		},
		async (request, reply) => {
			const { userId: sendUserId } = getTokenHeaderSchema.parse(request.headers)

			const { receiveUserId, notificationType } = getNotificationBodySchema.parse(request.body)

			await prisma.notifications.create({
				data: {
					notificationType,
					sendUserId,
					receiveUserId
				}
			})

			return reply.status(201).send('Notification sended successfully!')
		}
	)

	app.patch(
		'/:id',
		{
			preHandler: [checkSessionIdExists]
		},
		async (request, reply) => {
			const { id } = getNotificationParamsSchema.parse(request.params)

			await prisma.notifications.update({
				where: {
					id
				},
				data: {
					status: 'read'
				}
			})

			return reply.status(204)
		}
	)

	app.delete(
		'/:id',
		{
			preHandler: [checkSessionIdExists]
		},
		async (request, reply) => {
			const { id } = getNotificationParamsSchema.parse(request.params)

			await prisma.notifications.delete({
				where: { id }
			})

			return reply.status(204).send('Notification deleted successfully')
		}
	)

	app.delete(
		'/',
		{
			preHandler: [checkSessionIdExists]
		},
		async (request, reply) => {
			const { userId: receiveUserId } = getTokenHeaderSchema.parse(request.headers)
			await prisma.notifications.deleteMany({
				where: { receiveUserId }
			})

			return reply.status(204).send('All your notifications deleted successfully')
		}
	)
}
