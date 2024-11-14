import type {
	OneLessonUseCaseRequest,
	OneLessonUseCaseResponse
} from '../../../@types/use-cases/lessons'
import type { LessonsRepository } from '../../../repositories/lessons-repository'
import { BadRequestError } from '../../../routes/_errors/bad-request-error'

export class GetLessonUseCase {
	constructor(private lessonRepository: LessonsRepository) {}

	async execute({
		slug
	}: OneLessonUseCaseRequest): Promise<OneLessonUseCaseResponse> {
		const lesson = await this.lessonRepository.findBySlug(slug)

		if (!lesson) {
			throw new BadRequestError('Lesson not found.')
		}
		return {
			lesson
		}
	}
}
