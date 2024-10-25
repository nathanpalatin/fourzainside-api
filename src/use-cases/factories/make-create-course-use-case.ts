import { PrismaCourseRepository } from '../../repositories/prisma/prisma-course-repository'
import { CreateCourseUseCase } from '../courses/create-course'

export function makeCreateCourseUseCase() {
	const courseRepository = new PrismaCourseRepository()
	const useCase = new CreateCourseUseCase(courseRepository)

	return useCase
}
