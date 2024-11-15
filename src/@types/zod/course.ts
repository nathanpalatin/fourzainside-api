import { z } from 'zod'

export const createCourseSchemaBody = z.object({
	title: z.string(),
	description: z.string(),
	duration: z.number(),
	type: z.string(),
	image: z.string(),
	level: z.string(),
	tags: z.array(z.string().min(1).max(15))
})

export const getParamsCourseSchema = z.object({
	courseId: z.string()
})

export const getParamsCourseSlugSchema = z.object({
	slug: z.string()
})

export const getParamsSlugCourseSchema = z.object({
	slug: z.string()
})
