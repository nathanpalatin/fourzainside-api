import { z } from 'zod'

export const getPostBodySchema = z.object({
	title: z.string(),
	content: z.string()
})

export const getPostParamsSchema = z.object({
	id: z.string().uuid()
})

export const uploadMediaSchema = z.object({
	postId: z.string().uuid()
})
