import { expect, describe, it, beforeEach } from 'vitest'

import { InMemoryNotificationsRepository } from '../repositories/in-memory/in-memory-notifications-repository'
import { randomUUID } from 'crypto'
import { NotificationUseCase } from './create-notification'

let notificationRepository: InMemoryNotificationsRepository
let sut: NotificationUseCase

describe('Notification Use Case', () => {
	beforeEach(() => {
		notificationRepository = new InMemoryNotificationsRepository()
		sut = new NotificationUseCase(notificationRepository)
	})

	it('should be able to send a notification', async () => {
		const notification = await notificationRepository.create({
			notificationText: 'Test',
			notificationType: 'TRANSFER',
			receiveUserId: randomUUID(),
			sendUserId: randomUUID(),
			user: {}
		})

		expect(notification.id).toEqual(expect.any(String))
	})
})
