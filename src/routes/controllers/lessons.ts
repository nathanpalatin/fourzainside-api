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
import { getParamsCourseSlugSchema } from '../../@types/zod/course'

import { makeProgressUseCase } from '../../use-cases/factories/make-set-lesson-watched-use-case'
import { makeCreateLessonUseCase } from '../../use-cases/factories/make-create-lesson-use-case'
import { makeDeleteLessonUseCase } from '../../use-cases/factories/make-delete-lesson-use-case'
import { makeGetLessonCourseUseCase } from '../../use-cases/factories/make-get-lesson-use-case'
import { makeGetLessonsCourseUseCase } from '../../use-cases/factories/make-get-lesson-from-course'
import { makeGetCommentsLessonCourseUseCase } from '../../use-cases/factories/make-get-comments-from-lesson-use-case'
import { makeCreateCommentLessonCourseUseCase } from '../../use-cases/factories/make-create-comment-use-case'

import { BadRequestError } from '../_errors/bad-request-error'

export async function lessonsRoutes(app: FastifyInstance) {
	app.withTypeProvider<ZodTypeProvider>().post(
		'/',
		{
			preHandler: [checkSessionIdExists]
		},
		async (request, reply) => {
			const { title, description, video, courseId, moduleId } =
				createLessonSchemaBody.parse(request.body)

			try {
				const createLesson = makeCreateLessonUseCase()

				const { lesson } = await createLesson.execute({
					title,
					description,
					video,
					moduleId,
					courseId
				})

				return reply
					.status(201)
					.send({ id: lesson.id, message: 'Lesson created successfully.' })
			} catch (error) {
				throw error
			}
		}
	)

	app.withTypeProvider<ZodTypeProvider>().get(
		'/lesson/:courseSlug/:moduleSlug/:slug',
		{
			preHandler: [checkSessionIdExists]
		},
		async (request, reply) => {
			const { courseSlug, moduleSlug, slug } = getParamsOneLessonSchema.parse(
				request.params
			)

			try {
				const getLessonCourse = makeGetLessonCourseUseCase()

				const lesson = await getLessonCourse.execute({
					courseSlug,
					moduleSlug,
					slug
				})

				return reply.status(200).send(lesson)
			} catch (error) {
				if (error instanceof BadRequestError) {
					return reply.status(400).send({ message: error.message })
				}

				throw error
			}
		}
	)

	app.withTypeProvider<ZodTypeProvider>().get(
		'/:courseSlug/:moduleSlug',
		{
			preHandler: [checkSessionIdExists]
		},
		async (request, reply) => {
			const { courseSlug, moduleSlug } = getParamsCourseSlugSchema.parse(
				request.params
			)

			try {
				const getLessonsCourse = makeGetLessonsCourseUseCase()

				const lessons = await getLessonsCourse.execute({
					courseSlug,
					moduleSlug
				})

				return reply.status(200).send(lessons)
			} catch (error) {
				if (error instanceof BadRequestError) {
					return reply.status(400).send({ message: error.message })
				}

				throw error
			}
		}
	)

	app.withTypeProvider<ZodTypeProvider>().delete(
		'/:lessonId',
		{
			preHandler: [checkSessionIdExists]
		},
		async (request, reply) => {
			const { lessonId } = getParamsLessonSchema.parse(request.params)

			try {
				const deleteLesson = makeDeleteLessonUseCase()
				await deleteLesson.execute({ lessonId })

				return reply.status(204).send()
			} catch (error) {
				if (error instanceof BadRequestError) {
					return reply.status(400).send({ message: error.message })
				}

				throw error
			}
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
