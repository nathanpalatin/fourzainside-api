import { Knex } from 'knex'

declare module 'knex/types/tables' {
	export interface Tables {
		transactions: {
			id: string
			title: string
			userId: string
			amount: number
			type: string
			createdAt: Date
			updatedAt: Date
		}
		users: {
			id: string
			name: string
			username: string
			intId: number
			email: string
			password: string
			avatar: string
			createdAt: Date
			updatedAt: Date
			phone: string
		}
		products: {
			id: string
			title: string
			slug: string
			price: number
			image: string
			description: string
			featured: boolean
			userId: string
		}
		posts: {
			id: string
			title: string
			content: string
			userId: string
			createdAt: Date
			updatedAt: Date
		}
		medias: {
			id: string
			type: string
			source: string
			userId: string
			postId?: string
		}
		chats: {
			id: string
			userId: string
			chatWithId: string
			created_at: Date
			updated_at: Date
		}
		messages: {
			id: string
			sendUserId: string
			receiveUserId: string
			userName: string
			messageText: string
			messageType: string
			chatId: string
			created_at: Date
			updated_at: Date
		}
		notifications: {
			id: string
			status: string
			sendUserId: string
			receiveUserId: string
			notificationType: string
			created_at: Date
			updated_at: Date
		}
	}
}
