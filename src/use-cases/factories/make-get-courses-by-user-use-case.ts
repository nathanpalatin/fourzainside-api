import { PrismaCourseRepository } from '../../repositories/prisma/prisma-course-repository'
import { GetCoursesByUserUseCase } from '../courses/get-courses-by-user'

export function makeGetCourseByUserUseCase() {
	const courseRepository = new PrismaCourseRepository()
	const useCase = new GetCoursesByUserUseCase(courseRepository)

	return useCase
}
