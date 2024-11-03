import { PrismaCourseEnrollmentsRepository } from '../../repositories/prisma/prisma-enrollment-repository'
import { EnrollUserUseCase } from '../enrollments/insert-user-course'

export function makeEnrollUserCOurseUseCase() {
	const enrollRepository = new PrismaCourseEnrollmentsRepository()
	const useCase = new EnrollUserUseCase(enrollRepository)

	return useCase
}
