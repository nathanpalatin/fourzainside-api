import { z } from 'zod'

export const createCourseSchemaBody = z.object({
	title: z.string(),
	description: z.string(),
	type: z.string(),
	level: z.string(),
	tags: z.array(z.string().min(1).max(15))
})

export const getParamsCourseSchema = z.object({
	courseId: z.string()
})

export const getParamsCourseIdOrSlugSchema = z.object({
	courseIdOrSlug: z.string()
})

export const getParamsCourseSlugSchema = z.object({
	courseSlug: z.string(),
	moduleSlug: z.string()
})

export const getParamsSlugCourseSchema = z.object({
	slug: z.string()
})
