import { z } from 'zod'

export const createChatSchemaBody = z.object({
	chatWithId: z.string().uuid()
})

export const createMessageSchemaBody = z.object({
	receiveUserId: z.string().uuid(),
	chatId: z.string().uuid(),
	messageText: z.string(),
	messageType: z.string()
})

export const createMessageIdSchemaBody = z.object({
	id: z.string().uuid()
})

export const createMessagesSchemaBody = z.object({
	chatId: z.string().uuid()
})
