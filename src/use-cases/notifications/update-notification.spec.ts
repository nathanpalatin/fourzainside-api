import { randomUUID } from 'crypto'
import { expect, describe, it, beforeEach } from 'vitest'

import { InMemoryNotificationsRepository } from '../../repositories/in-memory/in-memory-notifications-repository'
import { UpdateNotificationUseCase } from './update-notification'

let notificationRepository: InMemoryNotificationsRepository
let sut: UpdateNotificationUseCase

describe('Update Notification Use Case', () => {
	beforeEach(() => {
		notificationRepository = new InMemoryNotificationsRepository()
		sut = new UpdateNotificationUseCase(notificationRepository)
	})

	it('should be able to read a notification', async () => {
		const notificationCreated = await notificationRepository.create({
			notificationText: 'Test',
			notificationType: 'TRANSFER',
			userId: randomUUID(),
			sendUserId: randomUUID()
		})

		const { notification } = await sut.execute({
			id: notificationCreated.id
		})

		expect(notification?.status).toBe('read')
	})
})
