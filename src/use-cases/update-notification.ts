import { BadRequestError } from '../routes/_errors/bad-request-error'
import type {
	NotificationUpdateUseCaseRequest,
	NotificationUseCaseResponse
} from '../@types/use-cases/notifications'
import type { NotificationsRepository } from '../repositories/notifications-repository'

export class UpdateNotificationUseCase {
	constructor(private notificationRepository: NotificationsRepository) {}

	async execute({
		notificationId
	}: NotificationUpdateUseCaseRequest): Promise<NotificationUseCaseResponse> {
		const notification =
			await this.notificationRepository.findById(notificationId)

		if (!notification) {
			throw new BadRequestError('Notification not found.')
		}

		await this.notificationRepository.update(notificationId)

		return {
			notification
		}
	}
}
