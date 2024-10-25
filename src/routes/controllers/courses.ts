import type { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { getTokenHeaderSchema } from '../../@types/zod/user'
import { createCourseSchemaBody } from '../../@types/zod/course'
import { makeCreateCourseUseCase } from '../../use-cases/factories/make-create-course-use-case'
import { checkSessionIdExists } from '../../middlewares/auth-token'
import { z } from 'zod'

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
						message: z.string()
					})
				}
			}
		},
		async (request, reply) => {
			const { userId } = getTokenHeaderSchema.parse(request.headers)

			const { title, description, image, duration, type, level } =
				createCourseSchemaBody.parse(request.body)

			const createCourse = makeCreateCourseUseCase()

			await createCourse.execute({
				title,
				description,
				image,
				level,
				duration,
				type,
				userId
			})

			return reply.status(201).send({ message: 'Course created successfully.' })
		}
	)
}
