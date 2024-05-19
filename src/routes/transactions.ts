import { FastifyInstance } from 'fastify'
import { knex } from '../database'

import { randomUUID } from 'node:crypto'
import { z } from 'zod'
import { checkSessionIdExists } from '../middlewares/auth-token'

export async function transactionsRoutes(app: FastifyInstance) {
	app.get(
		'/',
		{
			preHandler: [checkSessionIdExists]
		},
		async request => {
			const userSchemaBody = z.object({
				token: z.string().uuid()
			})

			const { token: userId } = userSchemaBody.parse(request.cookies)

			const transactions = await knex('transactions').select().where({
				userId
			})
			return { transactions }
		}
	)

	app.get(
		'/:id',
		{
			preHandler: [checkSessionIdExists]
		},
		async request => {
			const getTokenTransaction = z.object({
				token: z.string().uuid()
			})

			const getTransactionParamsSchema = z.object({
				id: z.string().uuid()
			})
			const { token: userId } = getTokenTransaction.parse(request.cookies)

			const { id } = getTransactionParamsSchema.parse(request.params)

			const transaction = await knex('transactions')
				.where({
					id,
					userId
				})
				.first()

			return { transaction }
		}
	)

	app.post(
		'/',
		{
			preHandler: [checkSessionIdExists]
		},
		async (request, reply) => {
			const getTokenTransaction = z.object({
				token: z.string().uuid()
			})

			const createTransactionBodySchema = z.object({
				title: z.string(),
				amount: z.number(),
				type: z.enum(['credit', 'debit'])
			})

			const { token: userId } = getTokenTransaction.parse(request.cookies)

			const { title, amount, type } = createTransactionBodySchema.parse(request.body)

			await knex('transactions').insert({
				id: randomUUID(),
				title,
				userId,
				amount: type === 'credit' ? amount : amount * -1,
				createdAt: new Date(),
				updatedAt: new Date(),
				type
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
			const getTransactionParamsSchema = z.object({
				id: z.string().uuid()
			})

			const createTransactionBodySchema = z.object({
				title: z.string(),
				amount: z.number(),
				type: z.enum(['credit', 'debit'])
			})
			const { token } = request.cookies
			const { id } = getTransactionParamsSchema.parse(request.params)

			const { title, amount, type } = createTransactionBodySchema.parse(request.body)

			await knex('transactions')
				.update({
					title,
					amount: type === 'credit' ? amount : amount * -1
				})
				.where({
					id,
					userId: token
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
			const { token: userId } = request.cookies
			await knex('transactions').delete().where({ userId })

			return reply.status(204).send('All your transactions deleted successfully')
		}
	)

	app.delete(
		'/:id',
		{
			preHandler: [checkSessionIdExists]
		},
		async (request, reply) => {
			const getTransactionParamsSchema = z.object({
				id: z.string().uuid()
			})

			const { id } = getTransactionParamsSchema.parse(request.params)

			await knex('transactions').delete().where({
				id
			})

			return reply.status(204).send('Transaction deleted successfully')
		}
	)
}
