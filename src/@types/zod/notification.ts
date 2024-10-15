import { z } from 'zod'

export const getNotificationBodySchema = z.object({
	receiveUserId: z.string().uuid(),
	notificationType: z.string()
})

export const getNotificationParamsSchema = z.object({
	id: z.string().uuid()
})
