import { z } from 'zod'

export const createModuleBodySchema = z.object({
	title: z.string(),
	description: z.string(),
	available: z.string(),
	visibility: z.boolean(),
	courseId: z.string()
})

export const getParamsModuleSchema = z.object({
	id: z.string()
})
