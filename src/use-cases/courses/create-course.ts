import type {
	CourseUseCaseRequest,
	CourseUseCaseResponse
} from '../../@types/use-cases/courses'
import type { CoursesRepository } from '../../repositories/courses-repository'

import { createSlug } from '../../utils/functions'

export class CreateCourseUseCase {
	constructor(private courseRepository: CoursesRepository) {}

	async execute({
		title,
		description,
		level,
		tags,
		type,
		userId
	}: CourseUseCaseRequest): Promise<CourseUseCaseResponse> {
		const course = await this.courseRepository.create({
			title,
			slug: createSlug(title),
			description,
			tags,
			level,
			type,
			userId,
			createdAt: new Date(),
			updatedAt: new Date()
		})

		return {
			course
		}
	}
}
