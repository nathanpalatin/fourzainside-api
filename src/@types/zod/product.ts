import { z } from 'zod'

export const createProductsBodySchema = z.object({
	title: z.string(),
	slug: z.string(),
	description: z.string(),
	price: z.number(),
	image: z.string(),
	featured: z.boolean()
})

export const getProductsParamsSchema = z.object({
	slug: z.string()
})

export const getProductParamsSchema = z.object({
	id: z.string().uuid()
})
