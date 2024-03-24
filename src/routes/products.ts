import { FastifyInstance } from 'fastify'
import { knex } from '../database'

import { randomUUID } from 'node:crypto'
import { z } from 'zod'
import { checkSessionIdExists } from '../middlewares/check-session-id'

export async function productsRoutes(app: FastifyInstance) {
	app.get('/', async () => {
			const products = await knex('Products').select()
			return  { products } 
		}
	)

	app.get('/:slug',async request => {
			const getTransactionParamsSchema = z.object({
				slug: z.string()
			})

			const { slug } = getTransactionParamsSchema.parse(request.params)

			const product = await knex('Products')
				.where({
					slug
				})
				.first()

			return  {product}
		}
	)

	app.post('/', async (request, reply) => {
		const createTransactionBodySchema = z.object({
			title: z.string(),
			slug: z.string(),
			description: z.string(),
			price: z.number(),
			image: z.string(),
			featured: z.boolean(),
		})

		const { title, slug, price, image, description, featured } = createTransactionBodySchema.parse(request.body)

		await knex('Products').insert({
			id: randomUUID(),
			title,
			slug,
			description,
			price,
			image,
			featured
		})

		return reply.status(201).send('Product created successfully!')
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
