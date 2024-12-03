import { PrismaCommentRepository } from '../../repositories/prisma/prisma-comment-repository'
import { DeleteCommentLessonUseCase } from '../courses/lessons/comments/delete-comment'

export function makeDeleteCommentUseCase() {
	const commentRepository = new PrismaCommentRepository()
	const useCase = new DeleteCommentLessonUseCase(commentRepository)

	return useCase
}
