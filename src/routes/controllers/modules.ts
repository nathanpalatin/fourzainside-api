import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { checkSessionIdExists } from '../../middlewares/auth-token'
import { makeCreateModuleUseCase } from '../../use-cases/factories/make-create-module-use-case'
import { createModuleBodySchema } from '../../@types/zod/module'
import { BadRequestError } from '../_errors/bad-request-error'
import { getParamsCourseSchema } from '../../@types/zod/course'
import { makeGetModulesUseCase } from '../../use-cases/factories/make-get-modules-use-case'

export async function modulesRoutes(app: FastifyInstance) {
	app.withTypeProvider<ZodTypeProvider>().post(
		'/',
		{
			preHandler: [checkSessionIdExists]
		},
		async (request, reply) => {
			const { title, courseId, description, available, visibility } =
				createModuleBodySchema.parse(request.body)

			try {
				const createModule = makeCreateModuleUseCase()
				const { module } = await createModule.execute({
					title,
					courseId,
					description,
					available,
					visibility
				})

				return reply.status(201).send({
					id: module.id,
					slug: module.slug,
					message: 'Module created successfully.'
				})
			} catch (error) {
				if (error instanceof BadRequestError) {
					return reply.status(400).send({ message: error.message })
				}

				throw error
			}
		}
	)

	app.withTypeProvider<ZodTypeProvider>().get(
		'/:courseIdOrSlug',
		{
			preHandler: [checkSessionIdExists]
		},
		async (request, reply) => {
			const { courseIdOrSlug } = getParamsCourseSchema.parse(request.params)

			try {
				const isUuid = /^[0-9a-fA-F-]{36}$/.test(courseIdOrSlug)
				const params = isUuid
					? { courseId: courseIdOrSlug }
					: { slug: courseIdOrSlug }

				const getModulesCourse = makeGetModulesUseCase()
				const modules = await getModulesCourse.execute(params)

				return reply.status(200).send(modules)
			} catch (error) {
				if (error instanceof BadRequestError) {
					return reply.status(400).send({ message: error.message })
				}

				throw error
			}
		}
	)
}
