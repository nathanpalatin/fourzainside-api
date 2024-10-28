import { PrismaUsersRepository } from '../../repositories/prisma/prisma-user-repository'
import { GetUsersCourseUseCase } from '../courses/get-users-from-course'

export function makeGetUsersCourseUseCase() {
	const usersRepository = new PrismaUsersRepository()
	const registerUseCase = new GetUsersCourseUseCase(usersRepository)
	return registerUseCase
}
