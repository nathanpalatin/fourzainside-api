import { hash } from 'bcrypt'
import { RegisterUseCaseRequest } from '../@types/use-cases/users'

import { Users } from '@prisma/client'
import type { UsersRepository } from '../repositories/users-repository'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'

interface RegisterUseCaseResponse {
	user: Users
}

export class RegisterUseCase {
	constructor(private usersRepository: UsersRepository) {}

	async execute({
		name,
		email,
		password,
		phone,
		username,
		cpf,
		birthdate
	}: RegisterUseCaseRequest): Promise<RegisterUseCaseResponse> {
		const userWithSameEmail = await this.usersRepository.findByEmail(email)

		if (userWithSameEmail) {
			throw new UserAlreadyExistsError()
		}

		const password_hash = await hash(password, 6)

		const user = await this.usersRepository.create({
			name,
			email,
			password: password_hash,
			phone,
			username,
			cpf,
			birthdate,
			createdAt: new Date(),
			updatedAt: new Date()
		})

		return {
			user
		}
	}
}
