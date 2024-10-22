import request from 'supertest'
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'

import { app } from '../../app'

import { randomUUID } from 'crypto'

import { createAndAuthenticateUser } from '../../utils/tests/create-and-authenticate'
import { InMemoryNotificationsRepository } from '../../repositories/in-memory/in-memory-notifications-repository'
import { NotificationUseCase } from '../../use-cases/create-notification'

let notificationsRepository: InMemoryNotificationsRepository
let sut: NotificationUseCase

describe('Notifications (e2e)', () => {
	beforeAll(async () => {
		await app.ready()
	})

	afterAll(async () => {
		await app.close()
	})

	beforeEach(() => {
		notificationsRepository = new InMemoryNotificationsRepository()
		sut = new NotificationUseCase(notificationsRepository)
	})

	it('should be able to get user notifications', async () => {
		const { token } = await createAndAuthenticateUser(app)

		const notificationResponse = await request(app.server)
			.get('/notifications')
			.set('Authorization', `${token}`)
			.send()

		expect(notificationResponse.statusCode).toEqual(200)
	})

	it('should be able to send a notification', async () => {
		const { token, userId } = await createAndAuthenticateUser(app)

		const notificationResponse = await request(app.server)
			.post('/notifications')
			.set('Authorization', `${token}`)
			.send({
				notificationType: 'NEWS',
				receiveUserId: randomUUID(),
				notificationText: 'Check out the new feature!'
			})
		expect(notificationResponse.statusCode).toEqual(200)
	})

	it('should be able to read a notification', async () => {
		const { token } = await createAndAuthenticateUser(app)

		const notificationId = await request(app.server)
			.post('/notifications')
			.set('Authorization', `${token}`)
			.send({
				notificationType: 'NEWS',
				receiveUserId: randomUUID(),
				notificationText: 'Check out the new feature!'
			})

		const notificationUpdateResponse = await request(app.server)
			.patch(`/notifications/${notificationId.body.id}`)
			.set('Authorization', `${token}`)
			.send()

		expect(notificationUpdateResponse.statusCode).toEqual(204)
	})
})
