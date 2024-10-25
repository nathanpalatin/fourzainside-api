import type { Users } from '@prisma/client'

export interface RegisterUseCaseRequest {
	name: string
	cpf: string
	username: string
	birthdate: string
	email: string
	password: string
	phone: string
}

export interface RegisterUseCaseResponse {
	user: Users
}
