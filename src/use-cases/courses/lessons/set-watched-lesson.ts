import type {
	GetLessonUseCaseRequest,
	LessonUpdateUseCaseResponse
} from '../../../@types/use-cases/lessons'
import type { ProgressRepository } from '../../../repositories/progress-repository'
import { BadRequestError } from '../../../routes/_errors/bad-request-error'

export class SetWatchedLessonUseCase {
	constructor(private progressRepository: ProgressRepository) {}

	async execute({
		userId,
		lessonId,
		moduleId,
		courseId
	}: GetLessonUseCaseRequest): Promise<LessonUpdateUseCaseResponse> {
		let progress = await this.progressRepository.findByIds(userId, lessonId)

		if (!courseId) {
			throw new BadRequestError('Progress not found')
		}
		if (!progress) {
			progress = await this.progressRepository.create({
				userId,
				courseId,
				moduleId,
				lessonId,
				completed: true,
				updatedAt: new Date()
			})
		} else {
			const newCompletedStatus = !progress.completed
			progress = await this.progressRepository.update(progress.id, {
				completed: newCompletedStatus,
				updatedAt: new Date()
			})
		}

		return {
			progress
		}
	}
}
