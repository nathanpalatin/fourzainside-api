import type { Notifications } from '@prisma/client'

export interface NotificationUseCaseRequest {
	notificationType: string
	notificationText: string
	sendUserId: string
	userId: string
}

export interface NotificationUpdateUseCaseRequest {
	id: string
}

export interface NotificationUseCaseResponse {
	notification: Notifications
}
