import type {
	GetLessonUseCaseRequest,
	LessonUpdateUseCaseResponse
} from '../../../@types/use-cases/lessons'
import type { ProgressRepository } from '../../../repositories/progress-repository'

export class SetWatchedLessonUseCase {
	constructor(private progressRepository: ProgressRepository) {}

	async execute({
		userId,
		lessonId,
		courseId
	}: GetLessonUseCaseRequest): Promise<LessonUpdateUseCaseResponse> {
		let progress = await this.progressRepository.findByIds(userId, lessonId)

		if (!progress) {
			progress = await this.progressRepository.create({
				userId,
				courseId,
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
