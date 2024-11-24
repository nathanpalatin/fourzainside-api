import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { checkSessionIdExists } from '../../middlewares/auth-token'
import { makeCreateModuleUseCase } from '../../use-cases/factories/make-create-module-use-case'
import { createModuleBodySchema } from '../../@types/zod/module'
import { BadRequestError } from '../_errors/bad-request-error'

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

				return reply
					.status(201)
					.send({ id: module.id, message: 'Module created successfully.' })
			} catch (error) {
				if (error instanceof BadRequestError) {
					return reply.status(400).send({ message: error.message })
				}

				throw error
			}
		}
	)
}
