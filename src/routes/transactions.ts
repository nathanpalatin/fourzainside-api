import { FastifyInstance } from 'fastify'
import { prisma } from '../lib/prisma'

import { checkSessionIdExists } from '../middlewares/auth-token'
import { getTokenHeaderSchema } from '../@types/zod/user'
import { createTransactionBodySchema, getTransactionParamsSchema } from '../@types/zod/transaction'

export async function transactionsRoutes(app: FastifyInstance) {
	app.get(
		'/',
		{
			preHandler: [checkSessionIdExists]
		},
		async (request, reply) => {
			const { userId } = getTokenHeaderSchema.parse(request.headers)

			const transactions = await prisma.transactions.findMany({
				where: { userId }
			})

			return reply.status(200).send({ transactions })
		}
	)

	app.get(
		'/:id',
		{
			preHandler: [checkSessionIdExists]
		},
		async (request, reply) => {
			const { userId } = getTokenHeaderSchema.parse(request.headers)
			const { id } = getTransactionParamsSchema.parse(request.params)

			const transaction = await prisma.transactions.findFirst({
				where: { id, userId }
			})

			return reply.status(200).send({ transaction })
		}
	)

	app.post(
		'/',
		{
			preHandler: [checkSessionIdExists]
		},
		async (request, reply) => {
			const { userId } = getTokenHeaderSchema.parse(request.headers)
			const { title, amount, type } = createTransactionBodySchema.parse(request.body)

			await prisma.transactions.create({
				data: {
					title,
					userId,
					amount: type === 'credit' ? amount : amount * -1,
					type
				}
			})

			return reply.status(201).send('Transaction created successfully!')
		}
	)

	app.put(
		'/:id',
		{
			preHandler: [checkSessionIdExists]
		},
		async (request, reply) => {
			const { userId } = getTokenHeaderSchema.parse(request.headers)

			const { id } = getTransactionParamsSchema.parse(request.params)

			const { title, amount, type } = createTransactionBodySchema.parse(request.body)

			await prisma.transactions.update({
				where: {
					id,
					userId
				},
				data: {
					title,
					amount: type === 'credit' ? amount : amount * -1
				}
			})

			return reply.status(204).send('Transaction updated successfully!')
		}
	)

	app.delete(
		'/',
		{
			preHandler: [checkSessionIdExists]
		},
		async (request, reply) => {
			const { userId } = getTokenHeaderSchema.parse(request.headers)

			await prisma.transactions.deleteMany({
				where: {
					userId
				}
			})

			return reply.status(204).send('All your transactions deleted successfully')
		}
	)

	app.delete(
		'/:id',
		{
			preHandler: [checkSessionIdExists]
		},
		async (request, reply) => {
			const { userId } = getTokenHeaderSchema.parse(request.headers)
			const { id } = getTransactionParamsSchema.parse(request.params)

			await prisma.transactions.delete({
				where: { userId, id }
			})

			return reply.status(204).send('Transaction deleted successfully')
		}
	)
}
