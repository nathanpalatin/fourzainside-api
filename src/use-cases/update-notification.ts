import { BadRequestError } from '../routes/_errors/bad-request-error'
import type {
	NotificationUpdateUseCaseRequest,
	NotificationUseCaseResponse
} from '../@types/use-cases/notifications'
import type { NotificationsRepository } from '../repositories/notifications-repository'

export class UpdateNotificationUseCase {
	constructor(private notificationRepository: NotificationsRepository) {}

	async execute({
		id
	}: NotificationUpdateUseCaseRequest): Promise<NotificationUseCaseResponse> {
		const notification = await this.notificationRepository.findById(id)

		if (!notification) {
			throw new BadRequestError('Notification not found.')
		}

		const updatedNotification = await this.notificationRepository.update(id)

		return {
			notification: updatedNotification
		}
	}
}
