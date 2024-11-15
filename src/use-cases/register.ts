import { hash } from 'bcrypt'
import {
	RegisterUseCaseRequest,
	type RegisterUseCaseResponse
} from '../@types/use-cases/users'

import type { UsersRepository } from '../repositories/users-repository'

import { UserAlreadyExistsError } from './errors/user-already-exists-error'

export class RegisterUseCase {
	constructor(private usersRepository: UsersRepository) {}

	async execute({
		name,
		email,
		password,
		username,
		phone
	}: RegisterUseCaseRequest): Promise<RegisterUseCaseResponse> {
		const userWithSameEmail = await this.usersRepository.findByEmail(email)
		const userWithSamePhone = await this.usersRepository.findByPhone(phone)

		if (userWithSameEmail || userWithSamePhone) {
			throw new UserAlreadyExistsError()
		}

		const password_hash = await hash(password, 6)

		const user = await this.usersRepository.create({
			name,
			email,
			username,
			password: password_hash,
			phone,
			createdAt: new Date(),
			updatedAt: new Date()
		})

		return {
			user
		}
	}
}
