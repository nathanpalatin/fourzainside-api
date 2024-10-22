import { expect, describe, it, beforeEach } from 'vitest'

import { InMemoryNotificationsRepository } from '../repositories/in-memory/in-memory-notifications-repository'
import { randomUUID } from 'crypto'
import { UpdateNotificationUseCase } from './update-notification'

let notificationRepository: InMemoryNotificationsRepository
let sut: UpdateNotificationUseCase

describe('Update Notification Use Case', () => {
	beforeEach(() => {
		notificationRepository = new InMemoryNotificationsRepository()
		sut = new UpdateNotificationUseCase(notificationRepository)
	})

	it('should be able to read a notification', async () => {
		const notification = await notificationRepository.create({
			notificationText: 'Test',
			notificationType: 'TRANSFER',
			receiveUserId: randomUUID(),
			sendUserId: randomUUID(),
			user: {}
		})

		await sut.execute({ id: notification.id })

		const updatedNotification = await notificationRepository.findById(
			notification.id
		)

		expect(updatedNotification).toBeTruthy()
		expect(updatedNotification?.status).toBe('read')
	})
})
