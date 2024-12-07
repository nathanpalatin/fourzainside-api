import { PrismaUsersRepository } from '../../repositories/prisma/prisma-user-repository'
import { GetEnsignsUserUseCase } from '../profile/get-ensigns-profile'

export function makeGetEnsginsUserUseCase() {
	const usersRepository = new PrismaUsersRepository()
	const useCase = new GetEnsignsUserUseCase(usersRepository)

	return useCase
}
