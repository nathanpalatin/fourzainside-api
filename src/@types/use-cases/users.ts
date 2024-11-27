import { Users } from '@prisma/client'

export interface RegisterUseCaseRequest {
	name: string
	phone: string
	username: string
	email: string
	password: string
}

export interface RegisterUseCaseResponse {
	user: Users
}

export interface UpdateAccountUseCaseRequest {
	userId: string
	name?: string
	phone?: string
	cpf?: string
	birthdate?: string
	gender?: string
	address?: string
	zipCode?: string
	complement?: string
	international?: boolean
	neighborhood?: string
	number?: string
	city?: string
	uf?: string
}
