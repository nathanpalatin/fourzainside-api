import { FastifyInstance } from 'fastify'
import { checkSessionIdExists } from '../middlewares/auth-token'
import { prisma } from '../lib/prisma'
import { createCryptoBodySchema, createWalletSchema, getTokenHeaderSchema } from '../@types/zod/user'
import { BadRequestError } from './_errors/bad-request-error'

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

	app.post(
		'/',
		{
			preHandler: [checkSessionIdExists]
		},
		async (request, reply) => {
			const { userId } = getTokenHeaderSchema.parse(request.headers)

			const { balance, coinType, country } = createWalletSchema.parse(request.body)

			await prisma.wallets.create({
				data: {
					userId,
					balance,
					coinType,
					country
				}
			})

			return reply.status(200).send({ message: 'Wallet created successfully!' })
		}
	)

	app.post(
		'/crypto',
		{
			preHandler: [checkSessionIdExists]
		},
		async (request, reply) => {
			const { userId } = getTokenHeaderSchema.parse(request.headers)
			const { amount } = createCryptoBodySchema.parse(request.body)

			const wallet = await prisma.wallets.findFirst({
				where: {
					userId
				}
			})

			if (!wallet) {
				throw new BadRequestError('Wallet not found')
			}

			async function hash(string: string) {
				const utf8 = new TextEncoder().encode(string)
				const hashBuffer = await crypto.subtle.digest('SHA-256', utf8)
				const hashArray = Array.from(new Uint8Array(hashBuffer))
				const hashHex = hashArray.map(bytes => bytes.toString(16).padStart(2, '0')).join('')
				return hashHex
			}

			const address = await hash(amount)

			return reply.status(200).send({ message: 'Crypto deposited successfully', wallet_address: address })
		}
	)
}
