import type {
	CourseUseCaseRequest,
	CourseUseCaseResponse
} from '../../@types/use-cases/courses'
import type { CoursesRepository } from '../../repositories/courses-repository'

export class CreateCourseUseCase {
	constructor(private courseRepository: CoursesRepository) {}

	async execute({
		title,
		description,
		image,
		level,
		duration,
		type,
		userId
	}: CourseUseCaseRequest): Promise<CourseUseCaseResponse> {
		const courses = await this.courseRepository.create({
			title,
			description,
			image,
			level,
			duration,
			type,
			users: {
				connect: { id: userId }
			},
			createdAt: new Date(),
			updatedAt: new Date()
		})

		return {
			courses
		}
	}
}
