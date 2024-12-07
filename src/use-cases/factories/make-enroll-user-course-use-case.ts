import { PrismaCourseRepository } from '../../repositories/prisma/prisma-course-repository'
import { PrismaCourseEnrollmentsRepository } from '../../repositories/prisma/prisma-enrollment-repository'
import { PrismaUsersRepository } from '../../repositories/prisma/prisma-user-repository'
import { EnrollUserUseCase } from '../enrollments/insert-user-course'

export function makeEnrollUserCourseUseCase() {
	const courseRepository = new PrismaCourseRepository()
	const usersRepository = new PrismaUsersRepository()
	const enrollRepository = new PrismaCourseEnrollmentsRepository()
	const useCase = new EnrollUserUseCase(
		courseRepository,
		usersRepository,
		enrollRepository
	)

	return useCase
}
