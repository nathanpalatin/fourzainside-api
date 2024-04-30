import { FastifyInstance } from 'fastify'

import { z } from 'zod'
import { knex } from '../database'

import fs from 'node:fs'
import util from 'node:util'
import { pipeline } from 'node:stream'

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

	app.post(
		'/upload',
		{
			preHandler: [checkSessionIdExists]
		},
		async (request, reply) => {
			const tokenSchema = z.object({
				token: z.string().uuid()
			})

			const uploadMediaSchema = z.object({
			 postId: z.string().uuid()
			})

			const { token: userId } = tokenSchema.parse(request.cookies)
			const { postId } = uploadMediaSchema.parse(request.body)

			const parts = request.files()
			const pump = util.promisify(pipeline)
			const uploadedFiles = []

			const folder = `uploads/posts/${postId}`


			if (!fs.existsSync(folder)) {
				fs.mkdirSync(folder, { recursive: true })
			}
			for await (const part of parts) {
				const timestamp = new Date().getTime()
				const extension = part.filename.split('.').pop()
				const newFilename = `${timestamp}.${extension}`

				const filePath = `${folder}/${newFilename}`

				await pump(part.file, fs.createWriteStream(filePath))

				uploadedFiles.push(filePath)

				await knex('medias').insert({
							id: randomUUID(),
							postId,
							source: filePath,
							userId,
							type: 'image',	
				})
			}

			return reply.status(200).send({ message: 'Uploaded file successfully' })
		}
	)
}
