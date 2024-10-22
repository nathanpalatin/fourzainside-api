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
		receiveUserId
	}: NotificationUseCaseRequest): Promise<NotificationUseCaseResponse> {
		const notification = await this.notificationRepository.create({
			notificationType,
			notificationText,
			sendUserId,
			user: {
				connect: { id: sendUserId }
			},
			receiveUserId,
			status: 'unread',
			createdAt: new Date(),
			updatedAt: new Date()
		})

		return {
			notification
		}
	}
}
