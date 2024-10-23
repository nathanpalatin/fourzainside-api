import { PrismaNotificationRepository } from '../../repositories/prisma/prisma-notification-repository'
import { GetNotificationsUseCase } from '../get-notifications'

export function makeGetNotificationsUseCase() {
	const notificationRepository = new PrismaNotificationRepository()
	const useCase = new GetNotificationsUseCase(notificationRepository)

	return useCase
}
