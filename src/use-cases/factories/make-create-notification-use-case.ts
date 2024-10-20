import { PrismaNotificationRepository } from '../../repositories/prisma/prisma-notification.repository'
import { NotificationUseCase } from '../create-notification'

export function makeCreateNotificationUseCase() {
	const notificationRepository = new PrismaNotificationRepository()
	const useCase = new NotificationUseCase(notificationRepository)

	return useCase
}
