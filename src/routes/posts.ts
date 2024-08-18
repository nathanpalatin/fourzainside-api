import { FastifyInstance } from 'fastify'
import { prisma } from '@/lib/prisma'

import fs from 'node:fs'
import util from 'node:util'
import { pipeline } from 'node:stream'

import { randomUUID } from 'node:crypto'

import { checkSessionIdExists } from '../middlewares/auth-token'
import { getTokenHeaderSchema } from '../@types/zod/user'
import { getPostBodySchema, getPostParamsSchema, uploadMediaSchema } from '../@types/zod/post'

export async function postsRoutes(app: FastifyInstance) {
	app.get(
		'/',
		{
			preHandler: [checkSessionIdExists]
		},
		async (_request, reply) => {
			const posts = await prisma.posts.findMany({
				select: {
					id: true,
					title: true,
					content: true,
					userId: true,
					createdAt: true
				}
			})
			return reply.status(200).send({ posts })
		}
	)

	app.post(
		'/',
		{
			preHandler: [checkSessionIdExists]
		},
		async (request, reply) => {
			const { userId } = getTokenHeaderSchema.parse(request.headers)

			const { title, content } = getPostBodySchema.parse(request.body)

			await prisma.posts.create({
				data: {
					userId,
					content,
					title
				}
			})

			reply.status(201).send({ message: 'Post created successfully' })
		}
	)

	app.put(
		'/:id',
		{
			preHandler: [checkSessionIdExists]
		},
		async (request, reply) => {
			const { id } = getPostParamsSchema.parse(request.params)
			const { userId } = getTokenHeaderSchema.parse(request.headers)
			const { title, content } = getPostBodySchema.parse(request.body)

			await prisma.posts.update({
				where: {
					id,
					userId
				},
				data: {
					title,
					content
				}
			})
			return reply.status(204).send({ message: 'Post updated successfully.' })
		}
	)

	app.delete(
		'/',
		{
			preHandler: [checkSessionIdExists]
		},
		async (request, reply) => {
			const { userId } = getTokenHeaderSchema.parse(request.headers)

			await prisma.posts.deleteMany({
				where: {
					userId
				}
			})

			return reply.status(204).send('All your posts deleted successfully')
		}
	)

	app.post(
		'/upload',
		{
			preHandler: [checkSessionIdExists]
		},
		async (request, reply) => {
			const { userId } = getTokenHeaderSchema.parse(request.headers)
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

				await prisma.medias.create({
					data: {
						id: randomUUID(),
						postId,
						source: filePath,
						userId,
						type: 'image'
					}
				})
			}

			return reply.status(201).send({ message: 'Post media file uploaded successfully' })
		}
	)
}
