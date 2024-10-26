import type {
	CreateCommentUseCaseRequest,
	CreateCommentUseCaseResponse,
	LessonUseCaseRequest,
	ListCommentsUseCaseRequest
} from '../../../../@types/use-cases/lessons'
import type { CommentsRepository } from '../../../../repositories/comments-repository'
import type { LessonsRepository } from '../../../../repositories/lessons-repository'
import { BadRequestError } from '../../../../routes/_errors/bad-request-error'

export class CreateCommentLessonUseCase {
	constructor(
		private lessonRepository: LessonsRepository,
		private commentRepository: CommentsRepository
	) {}

	async execute({
		lessonId,
		content,
		userId,
		answer
	}: CreateCommentUseCaseRequest): Promise<CreateCommentUseCaseResponse> {
		const lesson = await this.lessonRepository.findById(lessonId)

		if (!lesson) {
			throw new BadRequestError('Lesson not found')
		}

		const comment = await this.commentRepository.create({
			content,
			userId,
			answer,
			lesson: {
				connect: {
					id: lessonId
				}
			}
		})

		return {
			comment
		}
	}
}
