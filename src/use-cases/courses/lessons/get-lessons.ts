import type {
	ListLessonsFromCourseUseCaseRequest,
	ListLessonsUseCaseResponse
} from '../../../@types/use-cases/lessons'
import type { LessonsRepository } from '../../../repositories/lessons-repository'
import { BadRequestError } from '../../../routes/_errors/bad-request-error'

export class GetLessonsCourseUseCase {
	constructor(private lessonRepository: LessonsRepository) {}

	async execute({
		slug
	}: ListLessonsFromCourseUseCaseRequest): Promise<ListLessonsUseCaseResponse> {
		const lessons = await this.lessonRepository.findMany(slug)

		if (!lessons) {
			throw new BadRequestError('Lessons not found.')
		}
		return {
			lessons
		}
	}
}
