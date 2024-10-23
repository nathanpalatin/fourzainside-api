import type { FastifyInstance } from 'fastify'

import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { checkSessionIdExists } from '../../middlewares/auth-token'
import { getTokenHeaderSchema } from '../../@types/zod/user'

import { makeTransactionUseCase } from '../../use-cases/factories/make-create-transaction-use-case'
import {
	createTransactionBodySchema,
	getTransactionParamsSchema
} from '../../@types/zod/transaction'
import { makeGetTransactionsUseCase } from '../../use-cases/factories/make-get-transactions-use-case'
import { makeGetTransactionUseCase } from '../../use-cases/factories/make-get-one-transaction-use-case'

export async function transactionsRoutes(app: FastifyInstance) {
	app.withTypeProvider<ZodTypeProvider>().post(
		'/',
		{
			preHandler: [checkSessionIdExists],
			schema: {
				tags: ['Transactions'],

				summary: 'Get user transactions'
			}
		},
		async (request, reply) => {
			const { userId } = getTokenHeaderSchema.parse(request.headers)

			const { title, amount, type } = createTransactionBodySchema.parse(
				request.body
			)

			const transactionUseCase = makeTransactionUseCase()

			const { transaction } = await transactionUseCase.execute({
				title,
				amount,
				type,
				userId
			})

			return reply.status(201).send({
				id: transaction.id,
				message: 'Transaction was successfully created!'
			})
		}
	)

	app.withTypeProvider<ZodTypeProvider>().get(
		'/',
		{
			preHandler: [checkSessionIdExists],
			schema: {
				tags: ['Transactions'],
				summary: 'Get all user transactions'
			}
		},
		async (request, reply) => {
			const { userId } = getTokenHeaderSchema.parse(request.headers)

			const transactionsList = makeGetTransactionsUseCase()
			const { transactions } = await transactionsList.execute({ userId })

			reply.status(200).send({ transactions })
		}
	)

	app.withTypeProvider<ZodTypeProvider>().get(
		'/:transactionId',
		{
			preHandler: [checkSessionIdExists],
			schema: {
				tags: ['Transactions'],
				summary: 'Get one transaction'
			}
		},
		async (request, reply) => {
			const { transactionId } = getTransactionParamsSchema.parse(request.params)

			const oneTransaction = makeGetTransactionUseCase()
			const { transaction } = await oneTransaction.execute({
				transactionId
			})

			reply.status(200).send({ transaction })
		}
	)
}
