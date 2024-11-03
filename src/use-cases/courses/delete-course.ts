import type {
	DeleteCourseUseCaseRequest,
	DeleteCourseUseCaseResponse
} from '../../@types/use-cases/courses'
import type { CoursesRepository } from '../../repositories/courses-repository'

export class DeleteCourseUseCase {
	constructor(private courseRepository: CoursesRepository) {}

	async execute({
		courseId
	}: DeleteCourseUseCaseRequest): Promise<DeleteCourseUseCaseResponse> {
		const course = await this.courseRepository.findById(courseId)

		await this.courseRepository.delete(courseId)

		return {
			course
		}
	}
}
