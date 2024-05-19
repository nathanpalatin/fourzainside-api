import { FastifyInstance } from 'fastify'
import { knex } from '../database'

import { randomUUID } from 'node:crypto'
import { z } from 'zod'
import { checkSessionIdExists } from '../middlewares/auth-token'
import { prisma } from '../lib/prisma'

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

			const notifications = await knex('notifications').select('*').where({
				receiveUserId
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

	app.put(
		'/:id',
		{
			preHandler: [checkSessionIdExists]
		},
		async (request, reply) => {
			const getTransactionParamsSchema = z.object({
				userId: z.string().uuid()
			})

			const { userId: receiveUserId } = getTransactionParamsSchema.parse(request.headers)

			await knex('notifications')
				.update({
					status: 'read'
				})
				.where({
					receiveUserId
				})

			return reply.status(204)
		}
	)

	app.delete(
		'/',
		{
			preHandler: [checkSessionIdExists]
		},
		async (request, reply) => {
			const getTransactionParamsSchema = z.object({
				userId: z.string().uuid()
			})

			const { userId: receiveUserId } = getTransactionParamsSchema.parse(request.headers)

			await knex('notifications').delete().where({ receiveUserId })

			return reply.status(204).send('All your notifications deleted successfully')
		}
	)

	app.delete(
		'/:id',
		{
			preHandler: [checkSessionIdExists]
		},
		async (request, reply) => {
			const getTransactionParamsSchema = z.object({
				userId: z.string().uuid()
			})

			const { userId: receiveUserId } = getTransactionParamsSchema.parse(request.headers)

			await knex('notifications').delete().where({
				receiveUserId
			})

			return reply.status(204).send('Transaction deleted successfully')
		}
	)
}
