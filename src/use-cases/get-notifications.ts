import { Notifications } from '@prisma/client'

import { NotificationsRepository } from '../repositories/notifications-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

interface NotificationUseCaseRequest {
	userId: string
}

interface NotificationsUseCaseResponse {
	notifications: Notifications[]
}

export class GetNotificationsUseCase {
	constructor(private notificationsRepository: NotificationsRepository) {}

	async execute({
		userId
	}: NotificationUseCaseRequest): Promise<NotificationsUseCaseResponse> {
		const notifications = await this.notificationsRepository.findMany(userId)

		if (!notifications) {
			throw new ResourceNotFoundError()
		}

		return {
			notifications
		}
	}
}
