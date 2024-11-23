import type {
	NotificationUseCaseRequest,
	NotificationUseCaseResponse
} from '../@types/use-cases/notifications'
import type { NotificationsRepository } from '../repositories/notifications-repository'

export class CreateNotificationUseCase {
	constructor(private notificationRepository: NotificationsRepository) {}

	async execute({
		notificationType,
		notificationText,
		sendUserId,
		userId
	}: NotificationUseCaseRequest): Promise<NotificationUseCaseResponse> {
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
