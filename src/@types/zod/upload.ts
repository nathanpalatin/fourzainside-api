import { z } from 'zod'

export const uploadBodySchema = z.object({
	name: z.string(),
	contentType: z.string().regex(/\w+\/[-+.\w]+/g)
})

export const getFileParamsSchema = z.object({
	name: z.string()
})
