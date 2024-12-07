import { PrismaNotificationRepository } from '../../repositories/prisma/prisma-notification-repository'
import { UpdateNotificationUseCase } from '../notifications/update-notification'

export function makeUpdateNotificationUseCase() {
	const notificationRepository = new PrismaNotificationRepository()
	const useCase = new UpdateNotificationUseCase(notificationRepository)

	return useCase
}
