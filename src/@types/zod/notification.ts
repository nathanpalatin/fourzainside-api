import { z } from 'zod'

export const createNotificationsSchema = z.object({
	notifications: z.array(
		z.object({
			id: z.string().uuid(),
			sendUserId: z.string(),
			userId: z.string(),
			notificationText: z.string().nullable(),
			status: z.string(),
			notificationType: z.string(),
			createdAt: z.date()
		})
	)
})

export const createNotificationSchema = z.object({
	notificationType: z.string(),
	userId: z.string().uuid(),
	notificationText: z.string().optional()
})

export const updateNotificationSchema = z.object({
	id: z.string().uuid()
})
