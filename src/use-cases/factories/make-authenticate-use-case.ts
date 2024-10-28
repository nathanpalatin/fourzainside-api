import { PrismaUsersRepository } from '../../repositories/prisma/prisma-user-repository'
import { AuthenticateUseCase } from '../authentication'

export function makeAuthenticateUserUseCase() {
	const usersRepository = new PrismaUsersRepository()
	const useCase = new AuthenticateUseCase(usersRepository)

	return useCase
}
