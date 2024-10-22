import type { FastifyInstance } from 'fastify'

import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { checkSessionIdExists } from '../../middlewares/auth-token'
import { getTokenHeaderSchema } from '../../@types/zod/user'

import { makeTransactionUseCase } from '../../use-cases/factories/make-create-transaction-use-case'
import { createTransactionBodySchema } from '../../@types/zod/transaction'

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

			await transactionUseCase.execute({
				title,
				amount,
				type,
				userId
			})

			return reply
				.status(201)
				.send({ message: 'Transaction was successfully created!' })
		}
	)
}
