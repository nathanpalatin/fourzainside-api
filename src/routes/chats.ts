import { FastifyInstance } from 'fastify'
import { prisma } from '@/lib/prisma'

import { checkSessionIdExists } from '@/middlewares/auth-token'
import { getTokenHeaderSchema } from '@/@types/zod/user'
import {
	createChatSchemaBody,
	createMessageIdSchemaBody,
	createMessageSchemaBody,
	createMessagesSchemaBody
} from '../@types/zod/chat'

export async function chatsRoutes(app: FastifyInstance) {
	app.get(
		'/',
		{
			preHandler: [checkSessionIdExists]
		},
		async (request, reply) => {
			const { userId } = getTokenHeaderSchema.parse(request.headers)

			const chats = await prisma.chats.findMany({
				where: {
					userId
				},
				select: {
					id: true,
					userId: true,
					chatWithId: true,
					createdAt: true
				}
			})
			return reply.status(200).send({ chats })
		}
	)

	app.post(
		'/',
		{
			preHandler: [checkSessionIdExists]
		},
		async (request, reply) => {
			const { userId } = getTokenHeaderSchema.parse(request.headers)
			const { chatWithId } = createChatSchemaBody.parse(request.body)

			const chat = await prisma.chats.create({
				data: {
					userId,
					chatWithId
				}
			})

			return reply.status(201).send({ chat })
		}
	)

	app.delete(
		'/',
		{
			preHandler: [checkSessionIdExists]
		},
		async (request, reply) => {
			const { userId } = getTokenHeaderSchema.parse(request.headers)

			await prisma.chats.deleteMany({
				where: {
					userId
				}
			})
			return reply.status(204).send({ message: 'All your chats deleted successfully' })
		}
	)

	/* ROTAS PARA AS MENSAGENS */

	app.post(
		'/message',
		{
			preHandler: [checkSessionIdExists]
		},
		async (request, reply) => {
			const { userId: sendUserId } = getTokenHeaderSchema.parse(request.headers)
			const { receiveUserId, userName, messageText, messageType, chatId } = createMessageSchemaBody.parse(
				request.body
			)

			const message = await prisma.messages.create({
				data: {
					chatId,
					sendUserId,
					receiveUserId,
					userName,
					messageText,
					messageType
				}
			})

			return reply.status(201).send(message)
		}
	)

	app.delete(
		'/message',
		{
			preHandler: [checkSessionIdExists]
		},
		async (request, reply) => {
			const { userId: sendUserId } = getTokenHeaderSchema.parse(request.headers)
			const { id } = createMessageIdSchemaBody.parse(request.body)

			await prisma.messages.delete({
				where: {
					id,
					sendUserId
				}
			})

			reply.status(204).send({ message: 'Message deleted successfully.' })
		}
	)

	app.get(
		'/messages/:chatId',
		{
			preHandler: [checkSessionIdExists]
		},
		async (request, reply) => {
			const { chatId } = createMessagesSchemaBody.parse(request.params)

			const messages = await prisma.messages.findMany({
				where: {
					chatId
				}
			})

			return reply.status(200).send({ messages })
		}
	)
}
