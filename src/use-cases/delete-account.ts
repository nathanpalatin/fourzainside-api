import type { Users } from '@prisma/client'
import type { UsersRepository } from '../repositories/users-repository'

import { BadRequestError } from '@/routes/_errors/bad-request-error'

interface DeleteAccountUseCaseRequest {
	userId: string
}

interface DeleteAccountUseCaseResponse {
	user: Users | null
}

export class deleteAccountUseCase {
	constructor(private usersRepository: UsersRepository) {}

	async execute({
		userId
	}: DeleteAccountUseCaseRequest): Promise<DeleteAccountUseCaseResponse> {
		const user = await this.usersRepository.delete(userId)

		if (!user) {
			throw new BadRequestError('User not found')
		}

		return {
			user
		}
	}
}
