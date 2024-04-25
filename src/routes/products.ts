import { FastifyInstance } from 'fastify'
import { knex } from '../database'

import { z } from 'zod'
import { randomUUID } from 'node:crypto'

import util from 'node:util'
import { pipeline } from 'node:stream'
import fs from 'node:fs'

import { checkSessionIdExists } from '../middlewares/check-session-id'

export async function productsRoutes(app: FastifyInstance) {
	app.get('/', async () => {
		const products = await knex('products').select('*')
		return { products }
	})

	app.get('/featured', async _request => {
		const productsFeatured = await knex('Products').where({
			featured: true
		})

		return { productsFeatured }
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

	app.get('/:slug', async request => {
		const getProductsParamsSchema = z.object({
			slug: z.string()
		})

		const { slug } = getProductsParamsSchema.parse(request.params)

		const product = await knex('Products')
			.where({
				slug
			})
			.first()

		return { product }
	})

	app.get('/search/:slug', async request => {
		const getProductsParamsSchema = z.object({
			slug: z.string()
		})

		const { slug } = getProductsParamsSchema.parse(request.params)

		const products = await knex('Products').whereILike('slug', `%${slug}%`)

		return { products }
	})

	app.post(
		'/',
		{
			preHandler: [checkSessionIdExists]
		},
		async (request, reply) => {
			const createProductsBodySchema = z.object({
				title: z.string(),
				slug: z.string(),
				description: z.string(),
				price: z.number(),
				image: z.string(),
				featured: z.boolean()
			})

			const { title, slug, price, image, description, featured } = createProductsBodySchema.parse(request.body)

			let token = request.cookies.token

			if (!token) {
				token = randomUUID()

				reply.cookie('token', token, {
					path: '/',
					maxAge: 60 * 60 * 24 * 7 // 7 days
				})
			}

			await knex('Products').insert({
				id: randomUUID(),
				title,
				slug,
				description,
				price,
				image,
				featured,
				session_id: token
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
