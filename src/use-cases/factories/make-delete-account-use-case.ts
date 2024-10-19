import { PrismaUsersRepository } from '../../repositories/prisma/prisma-user-repository'
import { deleteAccountUseCase } from '../delete-account'

export function makeDeleteAccountUseCase() {
	const usersRepository = new PrismaUsersRepository()
	const useCase = new deleteAccountUseCase(usersRepository)

	return useCase
}
