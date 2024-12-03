import type { CommentsRepository } from '../../../../repositories/comments-repository'
import { BadRequestError } from '../../../../routes/_errors/bad-request-error'

interface DeleteCommentUseCaseRequest {
	commentId: string
}

export class DeleteCommentLessonUseCase {
	constructor(private commentRepository: CommentsRepository) {}

	async execute({ commentId }: DeleteCommentUseCaseRequest): Promise<void> {
		const commentExists = await this.commentRepository.findById(commentId)

		if (!commentExists) {
			throw new BadRequestError('Comment not found')
		}

		await this.commentRepository.delete(commentId)
	}
}
