import { Knex } from 'knex'

declare module 'knex/types/tables' {
	export interface Tables {
		transactions: {
			id: string
			title: string
			amount: number
			created_at: string
			session_id?: string
		}
		users: {
			id: string
			name: string
			nickname: string
			email: string
			password: string
			avatar: string
			created_at: string
			updated_at: string
			cpf: string
		}
	}
}