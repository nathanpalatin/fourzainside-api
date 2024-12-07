import { PrismaUsersRepository } from '../../repositories/prisma/prisma-user-repository'
import { GetUserProfileUseCase } from '../profile/get-user-profile'

export function makeGetUserProfileUseCase() {
	const usersRepository = new PrismaUsersRepository()
	const useCase = new GetUserProfileUseCase(usersRepository)

	return useCase
}
