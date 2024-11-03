import type {
	ListCoursesUseCaseRequest,
	ListCoursesUseCaseResponse
} from '../../@types/use-cases/courses'
import type { CoursesRepository } from '../../repositories/courses-repository'
import { BadRequestError } from '../../routes/_errors/bad-request-error'

export class GetCourseByUserUseCase {
	constructor(private courseRepository: CoursesRepository) {}

	async execute({
		userId
	}: ListCoursesUseCaseRequest): Promise<ListCoursesUseCaseResponse> {
		const courses = await this.courseRepository.findMany(userId)

		if (!courses) {
			throw new BadRequestError('Courses not found.')
		}

		return {
			courses
		}
	}
}
