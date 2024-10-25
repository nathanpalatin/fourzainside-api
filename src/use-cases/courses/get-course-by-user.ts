import type {
	CourseUseCaseRequest,
	CourseUseCaseResponse,
	ListCoursesUseCaseRequest,
	ListCoursesUseCaseResponse
} from '../../@types/use-cases/courses'
import type { CoursesRepository } from '../../repositories/courses-repository'

export class GetCourseByUserUseCase {
	constructor(private courseRepository: CoursesRepository) {}

	async execute({
		userId
	}: ListCoursesUseCaseRequest): Promise<ListCoursesUseCaseResponse> {
		const courses = await this.courseRepository.findMany(userId)

		return {
			courses
		}
	}
}
