import type { Courses } from '@prisma/client'
import type { CoursesRepository } from '../../repositories/courses-repository'
import { BadRequestError } from '../../routes/_errors/bad-request-error'

interface ListCourseUseCaseRequest {
	slug: string
}

interface ListCourseUseCaseResponse {
	course: Courses
}

export class GetCourseUseCase {
	constructor(private courseRepository: CoursesRepository) {}

	async execute({
		slug
	}: ListCourseUseCaseRequest): Promise<ListCourseUseCaseResponse> {
		const course = await this.courseRepository.findBySlug(slug)

		if (!course) {
			throw new BadRequestError('Course not found')
		}

		return {
			course
		}
	}
}
