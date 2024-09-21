import { FastifyInstance } from 'fastify'
import { checkSessionIdExists } from '../middlewares/auth-token'
import { prisma } from '../lib/prisma'
import { getTokenHeaderSchema } from '../@types/zod/user'

export async function walletRoutes(app: FastifyInstance) {
	app.get(
		'/',
		{
			preHandler: [checkSessionIdExists]
		},
		async (request, reply) => {
			const { userId } = getTokenHeaderSchema.parse(request.headers)

			const balances = await prisma.wallets.findFirst({
				where: {
					userId
				}
			})

			return reply.status(200).send({ balances })
		}
	)
}
