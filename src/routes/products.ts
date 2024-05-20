import { FastifyInstance } from 'fastify'
import { knex } from '../database'

import { z } from 'zod'
import { randomUUID } from 'node:crypto'

import util from 'node:util'
import { pipeline } from 'node:stream'
import fs from 'node:fs'

import { checkSessionIdExists } from '../middlewares/auth-token'
import { prisma } from '../lib/prisma'

export async function productsRoutes(app: FastifyInstance) {
	app.get('/', async (_request, reply) => {
		const products = await prisma.products.findMany()
		return reply.status(200).send({ products })
	})

	app.get('/featured', async (_request, reply) => {
		const productsFeatured = await prisma.products.findMany({
			where: {
				featured: true
			}
		})

		return reply.status(200).send({ productsFeatured })
	})

	app.post(
		'/upload',
		{
			preHandler: [checkSessionIdExists]
		},
		async (request, reply) => {
			const parts = request.files()
			const pump = util.promisify(pipeline)
			const uploadedFiles = []

			const folder = 'uploads/products/'

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
			}

			return reply.status(200).send({ message: 'Uploaded files successfully' })
		}
	)

	app.get('/:slug', async (request, reply) => {
		const getProductsParamsSchema = z.object({
			slug: z.string()
		})

		const { slug } = getProductsParamsSchema.parse(request.params)

		const product = await prisma.products.findFirst({
			where: {
				slug
			}
		})

		return reply.status(200).send({ product })
	})

	app.get('/search/:slug', async (request, reply) => {
		const getProductsParamsSchema = z.object({
			slug: z.string()
		})

		const { slug } = getProductsParamsSchema.parse(request.params)

		const products = await prisma.products.findMany({
			where: {
				slug: {
					contains: slug,
					mode: 'insensitive'
				}
			}
		})

		return reply.status(200).send({ products })
	})

	app.post(
		'/',
		{
			preHandler: [checkSessionIdExists]
		},
		async (request, reply) => {
			const tokenSchemaCookie = z.object({
				token: z.string().uuid()
			})
			const createProductsBodySchema = z.object({
				title: z.string(),
				slug: z.string(),
				description: z.string(),
				price: z.number(),
				image: z.string(),
				featured: z.boolean()
			})

			const { token: userId } = tokenSchemaCookie.parse(request.cookies)

			const { title, slug, price, image, description, featured } = createProductsBodySchema.parse(request.body)

			await knex('products').insert({
				id: randomUUID(),
				title,
				slug,
				description,
				price,
				image,
				featured,
				userId
			})

			return reply.status(201).send('Product created successfully!')
		}
	)

	app.put(
		'/:id',
		{
			preHandler: [checkSessionIdExists]
		},
		async (request, reply) => {
			const getProductsParamsSchema = z.object({
				id: z.string().uuid()
			})

			const createProductsBodySchema = z.object({
				title: z.string(),
				slug: z.string(),
				price: z.number(),
				description: z.string(),
				image: z.string(),
				featured: z.boolean()
			})
			const { id } = getProductsParamsSchema.parse(request.params)

			const { title, price, slug, description, image, featured } = createProductsBodySchema.parse(request.body)

			await knex('Products')
				.update({
					title,
					slug,
					price,
					description,
					image,
					featured
				})
				.where({
					id
				})

			return reply.status(204).send('Product updated successfully!')
		}
	)

	app.delete(
		'/',
		{
			preHandler: [checkSessionIdExists]
		},
		async (request, reply) => {
			const { sessionId } = request.cookies
			await knex('Products').delete().where('session_id', sessionId)

			return reply.status(204).send('All your products deleted successfully')
		}
	)

	app.delete(
		'/:id',
		{
			preHandler: [checkSessionIdExists]
		},
		async (request, reply) => {
			const getProductsParamsSchema = z.object({
				id: z.string().uuid()
			})

			const { id } = getProductsParamsSchema.parse(request.params)

			await knex('Products').delete().where({
				id
			})

			return reply.status(204).send('Product deleted successfully')
		}
	)
}
