import { randomUUID } from 'node:crypto'
import { expect, describe, it, beforeEach } from 'vitest'

import { CreateNotificationUseCase } from './create-notification'
import { InMemoryUsersRepository } from '../../repositories/in-memory/in-memory-users-repository'
import { InMemoryNotificationsRepository } from '../../repositories/in-memory/in-memory-notifications-repository'

let userRepository: InMemoryUsersRepository
let notificationRepository: InMemoryNotificationsRepository
let sut: CreateNotificationUseCase

describe('Notification Use Case', () => {
	beforeEach(() => {
		userRepository = new InMemoryUsersRepository()
		notificationRepository = new InMemoryNotificationsRepository()
		sut = new CreateNotificationUseCase(userRepository, notificationRepository)
	})

	it('should be able to send a notification', async () => {
		const user = await userRepository.create({
			name: 'jao',
			phone: '+5511999999999',
			cpf: '12345678901',
			username: 'test',
			email: 'test@test.com',
			password: 'test'
		})
		const user2 = await userRepository.create({
			name: 'jao2',
			phone: '+5511999999991',
			cpf: '12345678902',
			username: 'test',
			email: 'test2@test.com',
			password: 'test'
		})
		const { notification } = await sut.execute({
			notificationText: 'Test',
			notificationType: 'TRANSFER',
			userId: user.id,
			sendUserId: user2.id
		})

		expect(notification.id).toEqual(expect.any(String))
	})
})
