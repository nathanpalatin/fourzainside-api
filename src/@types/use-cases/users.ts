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
