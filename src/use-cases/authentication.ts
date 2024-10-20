import type { Users } from '@prisma/client'
import { compare } from 'bcrypt'

import { InvalidCredentialsError } from './errors/invalid-credentials-error'
import type { UsersRepository } from '../repositories/users-repository'

interface AuthenticateUseCaseRequest {
	credential: string
	password: string
}

interface AuthenticateUseCaseResponse {
	user: Users
}

export class AuthenticateUseCase {
	constructor(private usersRepository: UsersRepository) {}

	async execute({
		credential,
		password
	}: AuthenticateUseCaseRequest): Promise<AuthenticateUseCaseResponse> {
		let user = await this.usersRepository.findByEmail(credential)

		if (!user) {
			user = await this.usersRepository.findByCPF(credential)
		}

		if (!user) {
			throw new InvalidCredentialsError()
		}

		const doesntPasswordMatches = await compare(password, user.password)

		if (!doesntPasswordMatches) {
			throw new InvalidCredentialsError()
		}

		return {
			user
		}
	}
}
