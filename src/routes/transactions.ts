import { FastifyInstance } from 'fastify'
import { knex } from '../database'

import { randomUUID } from 'node:crypto'
import { z } from 'zod'
import { checkSessionIdExists } from '../middlewares/check-session-id'

export async function transactionsRoutes(app: FastifyInstance) {
	app.get('/', async request => {
		const transactions = await knex('Transactions').select()
		return { transactions }
	})

	app.get(
		'/:id',
		{
			preHandler: [checkSessionIdExists]
		},
		async request => {
			const getTransactionParamsSchema = z.object({
				id: z.string().uuid()
			})
			const { sessionId } = request.cookies

			const { id } = getTransactionParamsSchema.parse(request.params)

			const transaction = await knex('transactions')
				.where({
					id,
					session_id: sessionId
				})
				.first()

			return { transaction }
		}
	)

	app.post('/', async (request, reply) => {
		const createTransactionBodySchema = z.object({
			title: z.string(),
			amount: z.number(),
			type: z.enum(['credit', 'debit']),
			userId: z.string()
		})

		const { title, userId, amount, type } = createTransactionBodySchema.parse(request.body)

		let sessionId = request.cookies.sessionId

		if (!sessionId) {
			sessionId = randomUUID()

			reply.cookie('sessionId', sessionId, {
				path: '/',
				maxAge: 60 * 60 * 24 * 7 // 7 days
			})
		}

		await knex('Transactions').insert({
			id: randomUUID(),
			title,
			userId,
			amount: type === 'credit' ? amount : amount * -1,
			session_id: sessionId,
			createdAt: new Date(),
			updatedAt: new Date(),
			type
		})

		return reply.status(201).send('Transaction created successfully!')
	})

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
			const { sessionId } = request.cookies
			const { id } = getTransactionParamsSchema.parse(request.params)

			const { title, amount, type } = createTransactionBodySchema.parse(request.body)

			await knex('transactions')
				.update({
					title,
					amount: type === 'credit' ? amount : amount * -1
				})
				.where({
					id,
					session_id: sessionId
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
			const { sessionId } = request.cookies
			await knex('transactions').delete().where('session_id', sessionId)

			return reply.status(204).send('All transactions deleted successfully')
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

			const { sessionId } = request.cookies
			const { id } = getTransactionParamsSchema.parse(request.params)

			await knex('transactions').delete().where({
				id,
				session_id: sessionId
			})

			return reply.status(204).send('Transaction deleted successfully')
		}
	)
}
