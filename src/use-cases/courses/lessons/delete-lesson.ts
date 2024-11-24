import type { Lessons } from '@prisma/client'
import type { LessonsRepository } from '../../../repositories/lessons-repository'
import { BadRequestError } from '../../../routes/_errors/bad-request-error'

interface LessonDeleteUseCaseRequest {
	lessonId: string
}

interface LessonDeleteUseCaseResponse {
	lesson: Lessons | null
}

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
