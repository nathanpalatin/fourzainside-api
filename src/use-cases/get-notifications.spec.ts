import { InMemoryNotificationsRepository } from '../repositories/in-memory/in-memory-notifications-repository'
import { expect, describe, it, beforeEach } from 'vitest'
import { GetNotificationsUseCase } from './get-notifications'
import { randomUUID } from 'crypto'

let notificationsRepository: InMemoryNotificationsRepository
let sut: GetNotificationsUseCase

describe('Get Notifications Use Case', () => {
	beforeEach(() => {
		notificationsRepository = new InMemoryNotificationsRepository()
		sut = new GetNotificationsUseCase(notificationsRepository)
	})

	it('should be able to get all notifications', async () => {
		const { notifications } = await sut.execute({
			userId: randomUUID()
		})

		expect(notifications).toBeTruthy()
	})
})
