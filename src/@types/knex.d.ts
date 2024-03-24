import { Knex } from 'knex'

declare module 'knex/types/tables' {
	export interface Tables {
		Transactions: {
			id: string
			title: string
			userId: string
			amount: number
			type: string
			createdAt: Date
			updatedAt: Date
			session_id?: string
		},
		Users: {
			id: string
			name: string
			username: string
			email: string
			password: string
			avatar: string
			createdAt: Date
			updatedAt: Date
			phone: string
		},
		Products: {
			id: string
      title: string
      slug: string
      price: number
      image: string
      description: string
      featured: boolean
		}
	}
}