import type { Courses } from '@prisma/client'
import type { CoursesRepository } from '../../repositories/courses-repository'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'

interface ListCourseUseCaseRequest {
	courseId: string
}

interface ListCourseUseCaseResponse {
	course: Courses
}

export class GetCourseUseCase {
	constructor(private courseRepository: CoursesRepository) {}

	async execute({
		courseId
	}: ListCourseUseCaseRequest): Promise<ListCourseUseCaseResponse> {
		const course = await this.courseRepository.findById(courseId)

		if (!course) {
			throw new ResourceNotFoundError()
		}

		return {
			course
		}
	}
}
