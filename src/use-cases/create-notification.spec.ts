import { expect, describe, it, beforeEach } from 'vitest'

import { InMemoryNotificationsRepository } from '../repositories/in-memory/in-memory-notifications-repository'
import { randomUUID } from 'crypto'
import { CreateNotificationUseCase } from './create-notification'

let notificationRepository: InMemoryNotificationsRepository
let sut: CreateNotificationUseCase

describe('Notification Use Case', () => {
	beforeEach(() => {
		notificationRepository = new InMemoryNotificationsRepository()
		sut = new CreateNotificationUseCase(notificationRepository)
	})

	it('should be able to send a notification', async () => {
		const notification = await notificationRepository.create({
			notificationText: 'Test',
			notificationType: 'TRANSFER',
			userId: randomUUID(),
			sendUserId: randomUUID()
		})

		expect(notification.id).toEqual(expect.any(String))
	})
})
