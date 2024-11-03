import type { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import {
	getParamsUserSchema,
	getTokenHeaderSchema
} from '../../@types/zod/user'
import {
	createCourseSchemaBody,
	getParamsCourseSchema,
	getParamsSlugCourseSchema
} from '../../@types/zod/course'
import { makeCreateCourseUseCase } from '../../use-cases/factories/make-create-course-use-case'
import { checkSessionIdExists } from '../../middlewares/auth-token'
import { z } from 'zod'
import { makeGetCourseByUserUseCase } from '../../use-cases/factories/make-get-courses-by-user-use-case'
import { makeDeleteCourseUseCase } from '../../use-cases/factories/make-delete-course-use-case'
import { makeGetCourseUseCase } from '../../use-cases/factories/make-get-one-course-use-case'

export async function coursesRoutes(app: FastifyInstance) {
	app.withTypeProvider<ZodTypeProvider>().post(
		'/',
		{
			preHandler: [checkSessionIdExists],
			schema: {
				tags: ['Courses'],
				summary: 'Create a new course',
				body: createCourseSchemaBody,
				response: {
					201: z.object({
						id: z.string(),
						message: z.string()
					})
				}
			}
		},
		async (request, reply) => {
			const { userId } = getTokenHeaderSchema.parse(request.headers)

			const { title, description, tags, image, duration, type, level } =
				createCourseSchemaBody.parse(request.body)

			const createCourse = makeCreateCourseUseCase()

			const { courses } = await createCourse.execute({
				title,
				description,
				image,
				level,
				tags,
				duration,
				type,
				userId
			})

			return reply
				.status(201)
				.send({ id: courses.id, message: 'Course created successfully.' })
		}
	)

	app.withTypeProvider<ZodTypeProvider>().get(
		'/:userId',
		{
			preHandler: [checkSessionIdExists],
			schema: {
				tags: ['Courses'],
				summary: 'List all courses'
			}
		},
		async (request, reply) => {
			const { userId } = getParamsUserSchema.parse(request.params)

			const getUserCourses = makeGetCourseByUserUseCase()

			const courses = await getUserCourses.execute({ userId })

			return reply.status(200).send(courses)
		}
	)

	app.withTypeProvider<ZodTypeProvider>().get(
		'/c/:slug',
		{
			preHandler: [checkSessionIdExists],
			schema: {
				tags: ['Courses'],
				summary: 'Get one course'
			}
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
			preHandler: [checkSessionIdExists],
			schema: {
				tags: ['Courses'],
				summary: 'Delete a course'
			}
		},
		async (request, reply) => {
			const { courseId } = getParamsCourseSchema.parse(request.params)

			const deleteCourseFromUser = makeDeleteCourseUseCase()

			const courses = await deleteCourseFromUser.execute({ courseId })

			return reply.status(200).send(courses)
		}
	)
}
