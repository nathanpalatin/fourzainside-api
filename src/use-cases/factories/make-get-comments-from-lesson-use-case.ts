import { PrismaCommentRepository } from '../../repositories/prisma/prisma-comment-repository'
import { PrismaLessonRepository } from '../../repositories/prisma/prisma-lesson-repository'
import { GetCommentsLessonUseCase } from '../courses/lessons/comments/get-comments'

export function makeGetCommentsLessonCourseUseCase() {
	const commentRepository = new PrismaCommentRepository()
	const lessonRepository = new PrismaLessonRepository()
	const useCase = new GetCommentsLessonUseCase(
		lessonRepository,
		commentRepository
	)

	return useCase
}
