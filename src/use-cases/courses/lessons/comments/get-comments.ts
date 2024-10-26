import type {
	ListCommentsUseCaseRequest,
	ListCommentsUseCaseResponse
} from '../../../../@types/use-cases/lessons'
import type { CommentsRepository } from '../../../../repositories/comments-repository'
import type { LessonsRepository } from '../../../../repositories/lessons-repository'
import { BadRequestError } from '../../../../routes/_errors/bad-request-error'

export class GetCommentsLessonUseCase {
	constructor(
		private lessonRepository: LessonsRepository,
		private commentRepository: CommentsRepository
	) {}

	async execute({
		lessonId
	}: ListCommentsUseCaseRequest): Promise<ListCommentsUseCaseResponse> {
		const lessons = await this.lessonRepository.findById(lessonId)

		if (!lessons) {
			throw new BadRequestError('lesson not found')
		}

		const comments = await this.commentRepository.findMany(lessons.id)

		return {
			comments
		}
	}
}
