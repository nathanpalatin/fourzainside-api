import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { app } from '../../app'

import { createAndAuthenticateUser } from '../../utils/tests/create-and-authenticate'

describe('Notifications (e2e)', () => {
	beforeAll(async () => {
		await app.ready()
	})

	afterAll(async () => {
		await app.close()
	})

	it('should be able to get user notifications', async () => {
		const { token } = await createAndAuthenticateUser(app, false, true)

		const notificationResponse = await request(app.server)
			.get('/notifications')
			.set('Authorization', `${token}`)
			.send()

		expect(notificationResponse.statusCode).toEqual(200)
	})

	it('should be able to send a notification', async () => {
		const { token } = await createAndAuthenticateUser(app, true, true)
		const { userId } = await createAndAuthenticateUser(app, false, true)

		const notificationResponse = await request(app.server)
			.post('/notifications')
			.set('Authorization', `${token}`)
			.send({
				notificationType: 'NEWS',
				userId,
				notificationText: 'Check out the new feature!'
			})
		expect(notificationResponse.statusCode).toEqual(201)
	})

	it('should be able to read a notification', async () => {
		const { token, userId } = await createAndAuthenticateUser(app, false, true)

		const notificationId = await request(app.server)
			.post('/notifications')
			.set('Authorization', `${token}`)
			.send({
				notificationType: 'NEWS',
				userId,
				notificationText: 'Check out the new feature!'
			})

		const notificationUpdateResponse = await request(app.server)
			.patch(`/notifications/${notificationId.body.id}`)
			.set('Authorization', `${token}`)
			.send()

		expect(notificationUpdateResponse.statusCode).toEqual(204)
	})
})
