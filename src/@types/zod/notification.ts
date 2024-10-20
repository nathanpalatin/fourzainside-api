import { z } from 'zod'

export const createNotificationsSchema = z.object({
	notifications: z.array(
		z.object({
			id: z.string().uuid(),
			sendUserId: z.string(),
			receiveUserId: z.string(),
			notificationText: z.string().nullable(),
			status: z.string(),
			notificationType: z.string(),
			createdAt: z.date()
		})
	)
})

export const createNotificationSchema = z.object({
	notificationType: z.string(),
	receiveUserId: z.string().uuid(),
	notificationText: z.string().optional()
})
