import { z } from 'zod'

export const getNotificationBodySchema = z.object({
	receiveUserId: z.string().uuid(),
	notificationType: z.string()
})

export const getTransactionParamsSchema = z.object({
	transactionId: z.string().uuid()
})

export const createTransactionBodySchema = z.object({
	title: z.string(),
	amount: z.number(),
	type: z.enum(['credit', 'debit'])
})
