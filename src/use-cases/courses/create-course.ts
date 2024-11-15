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
		image,
		level,
		tags,
		duration,
		type,
		userId
	}: CourseUseCaseRequest): Promise<CourseUseCaseResponse> {
		const courses = await this.courseRepository.create({
			title,
			slug: createSlug(title),
			description,
			image,
			tags,
			level,
			duration,
			type,
			userId,
			createdAt: new Date(),
			updatedAt: new Date()
		})

		return {
			courses
		}
	}
}
