import type { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'

import { checkSessionIdExists } from '../../middlewares/auth-token'

import {
	createCommentLessonSchemaBody,
	createLessonSchemaBody,
	getParamsLessonSchema,
	getParamsOneLessonSchema,
	updateProgressLessonSchema
} from '../../@types/zod/lesson'

import { getTokenHeaderSchema } from '../../@types/zod/user'
import { getParamsCourseSchema } from '../../@types/zod/course'

import { makeCreateLessonUseCase } from '../../use-cases/factories/make-create-lesson-use-case'
import { makeDeleteLessonUseCase } from '../../use-cases/factories/make-delete-lesson-use-case'
import { makeProgressUseCase } from '../../use-cases/factories/make-set-lesson-watched-use-case'
import { makeGetLessonsCourseUseCase } from '../../use-cases/factories/make-get-lesson-from-course'
import { makeCreateCommentLessonCourseUseCase } from '../../use-cases/factories/make-create-comment-use-case'
import { makeGetCommentsLessonCourseUseCase } from '../../use-cases/factories/make-get-comments-from-lesson-use-case'
import { makeGetLessonCourseUseCase } from '../../use-cases/factories/make-get-lesson-use-case'

export async function lessonsRoutes(app: FastifyInstance) {
	app.withTypeProvider<ZodTypeProvider>().post(
		'/',
		{
			preHandler: [checkSessionIdExists]
		},
		async (request, reply) => {
			const { title, description, video, courseId, duration } =
				createLessonSchemaBody.parse(request.body)

			const createLesson = makeCreateLessonUseCase()

			const { lesson } = await createLesson.execute({
				title,
				description,
				duration,
				video,
				courseId
			})

			return reply
				.status(201)
				.send({ id: lesson.id, message: 'Lesson created successfully.' })
		}
	)

	app.withTypeProvider<ZodTypeProvider>().get(
		'/lesson/:slug',
		{
			preHandler: [checkSessionIdExists]
		},
		async (request, reply) => {
			const { slug } = getParamsOneLessonSchema.parse(request.params)

			const getLessonCourse = makeGetLessonCourseUseCase()

			const lesson = await getLessonCourse.execute({ slug })

			return reply.status(200).send(lesson)
		}
	)

	app.withTypeProvider<ZodTypeProvider>().get(
		'/:courseId',
		{
			preHandler: [checkSessionIdExists]
		},
		async (request, reply) => {
			const { courseId } = getParamsCourseSchema.parse(request.params)

			const getLessonsCourse = makeGetLessonsCourseUseCase()

			const lessons = await getLessonsCourse.execute({ slug: courseId })

			return reply.status(200).send(lessons)
		}
	)

	app.withTypeProvider<ZodTypeProvider>().delete(
		'/:lessonId',
		{
			preHandler: [checkSessionIdExists]
		},
		async (request, reply) => {
			const { lessonId } = getParamsLessonSchema.parse(request.params)

			const deleteLesson = makeDeleteLessonUseCase()
			await deleteLesson.execute({ lessonId })

			return reply.status(204).send()
		}
	)

	app.withTypeProvider<ZodTypeProvider>().get(
		'/comments/:lessonId',
		{
			preHandler: [checkSessionIdExists]
		},
		async (request, reply) => {
			const { lessonId } = getParamsLessonSchema.parse(request.params)

			const getMakeComments = makeGetCommentsLessonCourseUseCase()
			const comments = await getMakeComments.execute({ lessonId })
			return reply.status(200).send(comments)
		}
	)

	app.withTypeProvider<ZodTypeProvider>().post(
		'/comments',
		{
			preHandler: [checkSessionIdExists]
		},
		async (request, reply) => {
			const { userId } = getTokenHeaderSchema.parse(request.headers)
			const { content, lessonId, answer } = createCommentLessonSchemaBody.parse(
				request.body
			)

			const makeCreateComment = makeCreateCommentLessonCourseUseCase()
			await makeCreateComment.execute({ content, lessonId, userId, answer })

			return reply
				.status(201)
				.send({ message: 'Comment created successfully.' })
		}
	)

	app.withTypeProvider<ZodTypeProvider>().patch(
		'/',
		{
			preHandler: [checkSessionIdExists]
		},
		async (request, reply) => {
			const { userId } = getTokenHeaderSchema.parse(request.headers)

			const { lessonId, courseId } = updateProgressLessonSchema.parse(
				request.body
			)

			const progressUpdate = makeProgressUseCase()

			await progressUpdate.execute({ userId, lessonId, courseId })

			return reply.status(200).send({ message: 'Lesson updated successfully.' })
		}
	)
}
