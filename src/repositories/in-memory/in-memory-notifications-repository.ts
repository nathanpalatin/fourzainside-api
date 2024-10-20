import { randomUUID } from 'node:crypto'

import { Prisma, type Notifications } from '@prisma/client'
import type { NotificationsRepository } from '../notifications-repository'

export class InMemoryNotificationsRepository
	implements NotificationsRepository
{
	public items: Notifications[] = []

	async findById(id: string) {
		const notification = this.items.find(item => item.id === id)

		if (!notification) {
			return null
		}

		return notification
	}

	async create(data: Prisma.NotificationsCreateInput) {
		const notification = {
			id: randomUUID(),
			notificationType: data.notificationType,
			notificationText: data.notificationText ?? '',
			sendUserId: data.sendUserId,
			receiveUserId: data.receiveUserId,
			status: data.status ?? 'unread',
			createdAt: new Date(),
			userId: data.sendUserId,
			updatedAt: new Date()
		}

		this.items.push(notification)

		return notification
	}

	async delete(id: string) {
		const notification = this.items.find(item => item.id === id)
		if (!notification) {
			return null
		}
		return notification
	}

	async update(id: string) {
		const notification = this.items.find(item => item.id === id)
		if (!notification) {
			return null
		}
		return notification
	}
}
