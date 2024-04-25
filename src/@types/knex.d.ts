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
	}
}
