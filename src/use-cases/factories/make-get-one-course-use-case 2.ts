import { PrismaCourseRepository } from '../../repositories/prisma/prisma-course-repository'
import { GetCourseUseCase } from '../courses/get-one-course'

export function makeGetCourseUseCase() {
	const courseRepository = new PrismaCourseRepository()
	const useCase = new GetCourseUseCase(courseRepository)

	return useCase
}
