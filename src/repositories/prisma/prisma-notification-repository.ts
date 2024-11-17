import { Prisma } from '@prisma/client'

import { prisma } from '../../lib/prisma'
import type { NotificationsRepository } from '../notifications-repository'

export class PrismaNotificationRepository implements NotificationsRepository {
	async findById(id: string) {
		const notification = await prisma.notifications.findUnique({
			where: {
				id
			}
		})
		return notification
	}

	async findMany(userId: string) {
		const notification = await prisma.notifications.findMany({
			where: {
				userId
			},
			include: {
				sendUser: {
					select: {
						name: true,
						avatar: true
					}
				}
			}
		})
		return notification
	}

	async create(data: Prisma.NotificationsUncheckedCreateInput) {
		const notification = await prisma.notifications.create({
			data
		})
		return notification
	}

	async delete(id: string) {
		const notification = await prisma.notifications.delete({
			where: {
				id
			}
		})
		return notification
	}

	async update(id: string) {
		const notification = await prisma.notifications.update({
			where: {
				id
			},
			data: {
				status: 'read'
			}
		})
		return notification
	}
}
