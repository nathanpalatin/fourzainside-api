import { PrismaCourseEnrollmentsRepository } from '../../repositories/prisma/prisma-enrollment-repository'
import { EnrollUserUseCase } from '../enrollments/insert-user-course'

export function makeEnrollUserCourseUseCase() {
	const enrollRepository = new PrismaCourseEnrollmentsRepository()
	const useCase = new EnrollUserUseCase(enrollRepository)

	return useCase
}
