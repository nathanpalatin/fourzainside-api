import type {
	NotificationUseCaseRequest,
	NotificationUseCaseResponse
} from '../../@types/use-cases/notifications'
import type { NotificationsRepository } from '../../repositories/notifications-repository'
import type { UsersRepository } from '../../repositories/users-repository'
import { BadRequestError } from '../../routes/_errors/bad-request-error'

export class CreateNotificationUseCase {
	constructor(
		private userRepository: UsersRepository,
		private notificationRepository: NotificationsRepository
	) {}

	async execute({
		notificationType,
		notificationText,
		sendUserId,
		userId
	}: NotificationUseCaseRequest): Promise<NotificationUseCaseResponse> {
		const userExists = await this.userRepository.findById(userId)

		if (!userExists) {
			throw new BadRequestError('Receive user not found.')
		}

		const notification = await this.notificationRepository.create({
			notificationType,
			notificationText,
			sendUserId,
			userId,
			status: 'unread',
			createdAt: new Date(),
			updatedAt: new Date()
		})

		return {
			notification
		}
	}
}
