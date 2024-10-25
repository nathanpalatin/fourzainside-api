import { z } from 'zod'

export const createLessonSchemaBody = z.object({
	title: z.string(),
	description: z.string(),
	duration: z.number(),
	courseId: z.string(),
	video: z.string()
})
export const getParamsLessonSchema = z.object({
	lessonId: z.string()
})
