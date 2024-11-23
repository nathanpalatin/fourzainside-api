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

	async findMany(userId: string) {
		const notifications = {
			...this.items,
			userId
		}

		return notifications
	}

	async create(data: Prisma.NotificationsUncheckedCreateInput) {
		const notification = {
			id: randomUUID(),
			notificationType: data.notificationType,
			notificationText: data.notificationText ?? '',
			sendUserId: data.sendUserId,
			status: data.status ?? 'unread',
			createdAt: new Date(),
			userId: data.sendUserId,
			updatedAt: new Date()
		}

		this.items.push(notification)

		return notification
	}

	async update(id: string) {
		const notificationIndex = this.items.findIndex(item => item.id === id)

		if (notificationIndex === -1) {
			return null
		}

		this.items[notificationIndex] = {
			...this.items[notificationIndex],
			status: 'read'
		}

		return null
	}
}
