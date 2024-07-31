import { FastifyInstance } from 'fastify'
import { prisma } from '../lib/prisma'
import { z } from 'zod'

import { randomUUID } from 'node:crypto'
import { checkSessionIdExists } from '../middlewares/auth-token'

export async function notificationsRoutes(app: FastifyInstance) {
	app.get(
		'/',
		{
			preHandler: [checkSessionIdExists]
		},
		async (request, reply) => {
			const getNotificationParamsSchema = z.object({
				userId: z.string().uuid()
			})

			const { userId: receiveUserId } = getNotificationParamsSchema.parse(request.headers)

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
			const getNotificationBodySchema = z.object({
				receiveUserId: z.string().uuid(),
				notificationType: z.string()
			})
			const getNotificationHeaderSchema = z.object({
				userId: z.string().uuid()
			})

			const { userId: sendUserId } = getNotificationHeaderSchema.parse(request.headers)

			const { receiveUserId, notificationType } = getNotificationBodySchema.parse(request.body)

			await prisma.notifications.create({
				data: {
					id: randomUUID(),
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
			const getNotificationParamsSchema = z.object({
				id: z.string().uuid()
			})

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
			const getNotificationsParamsSchema = z.object({
				id: z.string().uuid()
			})

			const { id } = getNotificationsParamsSchema.parse(request.params)

			await prisma.notifications.delete({
				where: { id }
			})

			return reply.status(204).send('All your notifications deleted successfully')
		}
	)

	app.delete(
		'/',
		{
			preHandler: [checkSessionIdExists]
		},
		async (request, reply) => {
			const getNotificationsHeaderSchema = z.object({
				userId: z.string().uuid()
			})

			const { userId: receiveUserId } = getNotificationsHeaderSchema.parse(request.headers)
			await prisma.notifications.deleteMany({
				where: { receiveUserId }
			})

			return reply.status(204).send('All your notifications deleted successfully')
		}
	)
}
