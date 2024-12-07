import { PrismaNotificationRepository } from '../../repositories/prisma/prisma-notification-repository'
import { PrismaUsersRepository } from '../../repositories/prisma/prisma-user-repository'
import { CreateNotificationUseCase } from '../notifications/create-notification'

export function makeCreateNotificationUseCase() {
	const userRepository = new PrismaUsersRepository()
	const notificationRepository = new PrismaNotificationRepository()
	const useCase = new CreateNotificationUseCase(
		userRepository,
		notificationRepository
	)

	return useCase
}
