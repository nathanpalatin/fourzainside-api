import { FastifyInstance } from 'fastify'

import { z } from 'zod'
import { knex } from '../database'

import { randomUUID } from 'node:crypto'

import { checkSessionIdExists } from '../middlewares/check-session-id'

export async function postsRoutes(app: FastifyInstance) {
	app.get(
		'/',
		{
			preHandler: [checkSessionIdExists]
		},
		async (_request, reply) => {
			const posts = await knex('posts').select('id', 'title', 'content', 'userId', 'createdAt')

			reply.status(200)

			return { posts }
		}
	)

	app.post(
		'/',
		{
			preHandler: [checkSessionIdExists]
		},
		async (request, reply) => {
			const tokenSchema = z.object({
				token: z.string().uuid()
			})

			const postsSchemaBody = z.object({
				title: z.string(),
				content: z.string()
			})

			const { token: userId } = tokenSchema.parse(request.cookies)

			const { title, content } = postsSchemaBody.parse(request.body)

			await knex('posts').insert({
				id: randomUUID(),
				userId,
				content,
				title,
				createdAt: new Date(),
				updatedAt: new Date()
			})

			reply.status(201).send({ message: 'Post created successfully' })
		}
	)

	app.put(
		'/',
		{
			preHandler: [checkSessionIdExists]
		},
		async (request, reply) => {
			const tokenSchema = z.object({
				token: z.string().uuid()
			})

			const getTransactionParamsSchema = z.object({
				id: z.string().uuid(),
				title: z.string(),
				content: z.string()
			})

			const { token: userId } = tokenSchema.parse(request.cookies)
			const { id, title, content } = getTransactionParamsSchema.parse(request.body)

			await knex('posts')
				.update({
					title,
					content
				})
				.where({
					id,
					userId
				})

			reply.status(204).send({ message: '' })
		}
	)

	app.delete(
		'/',
		{
			preHandler: [checkSessionIdExists]
		},
		async (request, reply) => {
			const tokenSchema = z.object({
				token: z.string().uuid()
			})

			const getTransactionParamsSchema = z.object({
				id: z.string().uuid()
			})

			const { token: userId } = tokenSchema.parse(request.cookies)
			const { id } = getTransactionParamsSchema.parse(request.body)

			await knex('posts').delete('*').where({
				id,
				userId
			})

			return reply.status(204).send('Post deleted successfully')
		}
	)
}
