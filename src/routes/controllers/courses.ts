import type { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { getTokenHeaderSchema } from '../../@types/zod/user'

import {
	createCourseSchemaBody,
	getParamsCourseSchema,
	getParamsSlugCourseSchema
} from '../../@types/zod/course'
import { makeCreateCourseUseCase } from '../../use-cases/factories/make-create-course-use-case'
import { checkSessionIdExists } from '../../middlewares/auth-token'
import { makeGetCourseByUserUseCase } from '../../use-cases/factories/make-get-courses-by-user-use-case'
import { makeDeleteCourseUseCase } from '../../use-cases/factories/make-delete-course-use-case'
import { makeGetCourseUseCase } from '../../use-cases/factories/make-get-one-course-use-case'
import { makeEnrollUserCOurseUseCase } from '../../use-cases/factories/make-enroll-user-course-use-case'
import { StudentAlreadyEnrolledError } from '../../use-cases/errors/student-already-enrolled'

export async function coursesRoutes(app: FastifyInstance) {
	app.withTypeProvider<ZodTypeProvider>().post(
		'/',
		{
			preHandler: [checkSessionIdExists]
		},
		async (request, reply) => {
			const { userId } = getTokenHeaderSchema.parse(request.headers)

			const { title, description, tags, image, type, level } =
				createCourseSchemaBody.parse(request.body)

			const createCourse = makeCreateCourseUseCase()

			const { course } = await createCourse.execute({
				title,
				description,
				image,
				level,
				tags,
				type,
				userId
			})

			return reply
				.status(201)
				.send({ id: course.id, message: 'Course created successfully.' })
		}
	)

	app.withTypeProvider<ZodTypeProvider>().get(
		'/',
		{
			preHandler: [checkSessionIdExists]
		},
		async (request, reply) => {
			const { userId, role } = getTokenHeaderSchema.parse(request.headers)
			const getUserCourses = makeGetCourseByUserUseCase()

			const courses = await getUserCourses.execute({ userId, role })

			return reply.status(200).send(courses)
		}
	)

	app.withTypeProvider<ZodTypeProvider>().get(
		'/c/:slug',
		{
			preHandler: [checkSessionIdExists]
		},
		async (request, reply) => {
			const { slug } = getParamsSlugCourseSchema.parse(request.params)

			const getUserCourses = makeGetCourseUseCase()

			const course = await getUserCourses.execute({ slug })

			return reply.status(200).send(course)
		}
	)

	app.withTypeProvider<ZodTypeProvider>().delete(
		'/:courseId',
		{
			preHandler: [checkSessionIdExists]
		},
		async (request, reply) => {
			const { courseId } = getParamsCourseSchema.parse(request.params)

			const deleteCourseFromUser = makeDeleteCourseUseCase()

			const courses = await deleteCourseFromUser.execute({ courseId })

			return reply.status(200).send(courses)
		}
	)

	app.withTypeProvider<ZodTypeProvider>().post(
		'/enroll',
		{
			preHandler: [checkSessionIdExists]
		},
		async (request, reply) => {
			const { userId } = getTokenHeaderSchema.parse(request.headers)
			const { courseId } = getParamsCourseSchema.parse(request.body)

			try {
				const enrollUser = makeEnrollUserCOurseUseCase()
				await enrollUser.execute({
					userId,
					courseId
				})
			} catch (error) {
				if (error instanceof StudentAlreadyEnrolledError) {
					return reply.status(409).send({ message: error.message })
				}

				throw error
			}

			return reply
				.status(200)
				.send({ message: 'User enrolled in course successfully.' })
		}
	)
}
