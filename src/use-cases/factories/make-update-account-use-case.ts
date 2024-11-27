import { PrismaUsersRepository } from '../../repositories/prisma/prisma-user-repository'
import { UpdateAccountUseCase } from '../update-account'

export function makeUpdateAccountUseCase() {
	const usersRepository = new PrismaUsersRepository()
	const useCase = new UpdateAccountUseCase(usersRepository)

	return useCase
}
