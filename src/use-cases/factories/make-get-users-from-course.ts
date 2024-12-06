import { PrismaCourseEnrollmentsRepository } from '../../repositories/prisma/prisma-enrollment-repository'
import { GetUsersCourseUseCase } from '../courses/get-users-from-course'

export function makeGetUsersCourseUseCase() {
	const usersRepository = new PrismaCourseEnrollmentsRepository()
	const registerUseCase = new GetUsersCourseUseCase(usersRepository)
	return registerUseCase
}
