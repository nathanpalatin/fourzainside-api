import type {
	LessonDeleteUseCaseRequest,
	LessonDeleteUseCaseResponse
} from '../../../@types/use-cases/lessons'
import type { LessonsRepository } from '../../../repositories/lessons-repository'
import { BadRequestError } from '../../../routes/_errors/bad-request-error'

export class DeleteLessonUseCase {
	constructor(private lessonRepository: LessonsRepository) {}
	async execute({
		lessonId
	}: LessonDeleteUseCaseRequest): Promise<LessonDeleteUseCaseResponse> {
		const lesson = await this.lessonRepository.findById(lessonId)

		await this.lessonRepository.delete(lessonId)

		return { lesson }
	}
}
