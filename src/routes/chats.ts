import { FastifyInstance } from 'fastify'
import { prisma } from '../lib/prisma'
import { z } from 'zod'

import { randomUUID } from 'node:crypto'
import { checkSessionIdExists } from '../middlewares/auth-token'

export async function chatsRoutes(app: FastifyInstance) {
	app.get(
		'/',
		{
			preHandler: [checkSessionIdExists]
		},
		async (request, reply) => {
			const getChatsHeaderSchema = z.object({
				userId: z.string().uuid()
			})

			const { userId } = getChatsHeaderSchema.parse(request.headers)

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
			const getChatsHeaderSchema = z.object({
				userId: z.string().uuid()
			})

			const createChatSchemaBody = z.object({
				chatWithId: z.string().uuid()
			})

			const { userId } = getChatsHeaderSchema.parse(request.headers)

			const { chatWithId } = createChatSchemaBody.parse(request.body)

			const chat = await prisma.chats.create({
				data: {
					id: randomUUID(),
					userId,
					chatWithId,
					createdAt: new Date(),
					updatedAt: new Date()
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
			const getChatsHeaderSchema = z.object({
				userId: z.string().uuid()
			})

			const { userId } = getChatsHeaderSchema.parse(request.headers)

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
			const getChatsHeaderSchema = z.object({
				userId: z.string().uuid()
			})

			const createMessageSchemaBody = z.object({
				receiveUserId: z.string().uuid(),
				chatId: z.string().uuid(),
				messageText: z.string(),
				messageType: z.string(),
				userName: z.string()
			})

			const { userId: sendUserId } = getChatsHeaderSchema.parse(request.headers)

			const { receiveUserId, userName, messageText, messageType, chatId } = createMessageSchemaBody.parse(
				request.body
			)

			const message = await prisma.messages.create({
				data: {
					id: randomUUID(),
					chatId,
					sendUserId,
					receiveUserId,
					userName,
					messageText,
					messageType,
					createdAt: new Date(),
					updatedAt: new Date()
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
			const getChatsHeaderSchema = z.object({
				userId: z.string().uuid()
			})
			const createMessageSchemaBody = z.object({
				id: z.string().uuid()
			})

			const { userId: sendUserId } = getChatsHeaderSchema.parse(request.headers)

			const { id } = createMessageSchemaBody.parse(request.body)

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
			const createMessagesSchemaBody = z.object({
				chatId: z.string().uuid()
			})

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
