import type { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'

import { checkSessionIdExists } from '../../middlewares/auth-token'
import { z } from 'zod'
import {
	createLessonSchemaBody,
	getParamsLessonSchema
} from '../../@types/zod/lesson'
import { makeCreateLessonUseCase } from '../../use-cases/factories/make-create-lesson-use-case'
import { makeDeleteLessonUseCase } from '../../use-cases/factories/make-delete-lesson-use-case'
import { makeGetLessonsCourseUseCase } from '../../use-cases/factories/make-get-lesson-from-course'
import { getParamsCourseSchema } from '../../@types/zod/course'

export async function lessonsRoutes(app: FastifyInstance) {
	app.withTypeProvider<ZodTypeProvider>().post(
		'/',
		{
			preHandler: [checkSessionIdExists],
			schema: {
				tags: ['Lessons'],
				summary: 'Create a new lesson',
				body: createLessonSchemaBody,
				response: {
					201: z.object({
						message: z.string()
					})
				}
			}
		},
		async (request, reply) => {
			const { title, description, video, courseId, duration } =
				createLessonSchemaBody.parse(request.body)

			const createLesson = makeCreateLessonUseCase()

			await createLesson.execute({
				title,
				description,
				duration,
				video,
				courseId
			})

			return reply.status(201).send({ message: 'Lesson created successfully.' })
		}
	)

	app.withTypeProvider<ZodTypeProvider>().get(
		'/:courseId',
		{
			preHandler: [checkSessionIdExists],
			schema: {
				tags: ['Lessons'],
				summary: 'List all lessons from course'
			}
		},
		async (request, reply) => {
			const { courseId } = getParamsCourseSchema.parse(request.params)

			const getLessonsCourse = makeGetLessonsCourseUseCase()

			const lessons = await getLessonsCourse.execute({ courseId })

			return reply.status(200).send(lessons)
		}
	)

	app.withTypeProvider<ZodTypeProvider>().delete(
		'/:lessonId',
		{
			preHandler: [checkSessionIdExists],
			schema: {
				tags: ['Lessons'],
				summary: 'List all courses'
			}
		},
		async (request, reply) => {
			const { lessonId } = getParamsLessonSchema.parse(request.params)

			const deleteLesson = makeDeleteLessonUseCase()
			await deleteLesson.execute({ lessonId })

			return reply.status(204).send()
		}
	)
}
