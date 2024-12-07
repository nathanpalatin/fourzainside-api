import { Ensigns } from '@prisma/client'
import type { UsersRepository } from '../../repositories/users-repository'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'

interface GetUserProfileUseCaseRequest {
	userId: string
}

interface GetUserProfileUseCaseResponse {
	ensigns: Ensigns[] | null
}

export class GetEnsignsUserUseCase {
	constructor(private usersRepository: UsersRepository) {}

	async execute({
		userId
	}: GetUserProfileUseCaseRequest): Promise<GetUserProfileUseCaseResponse> {
		const ensigns = await this.usersRepository.findManyEnsigns(userId)

		return {
			ensigns
		}
	}
}
