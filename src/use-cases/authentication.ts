import { compare } from 'bcrypt'
import { InvalidCredentialsError } from './errors/invalid-credentials-error'
import type { UsersRepository } from '../repositories/users-repository'
import type { Users } from '@prisma/client'
import { sign } from 'jsonwebtoken'

interface AuthenticateUseCaseRequest {
	email: string
	password: string
}

interface AuthenticateUseCaseResponse {
	user: Users
}

export class AuthenticateUseCase {
	constructor(private usersRepository: UsersRepository) {}

	async execute({ email, password }: AuthenticateUseCaseRequest): Promise<AuthenticateUseCaseResponse> {
		const user = await this.usersRepository.findByEmail(email)

		if (!user) {
			throw new InvalidCredentialsError()
		}

		const doestPasswordMatches = await compare(password, user.password)

		if (!doestPasswordMatches) {
			throw new InvalidCredentialsError()
		}

		return {
			user
		}
	}
}
