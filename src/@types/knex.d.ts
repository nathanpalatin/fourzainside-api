import { Knex } from 'knex'

declare module 'knex/types/tables' {
	export interface Tables {
		transactions: {
			id: string
			title: string
			amount: number
			created_at: string
			session_id?: string
		},
		User: {
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