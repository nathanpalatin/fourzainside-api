makeCreateCommentLessonCourseUseCase

import { PrismaCommentRepository } from '../../repositories/prisma/prisma-comment-repository'
import { PrismaLessonRepository } from '../../repositories/prisma/prisma-lesson-repository'
import { CreateCommentLessonUseCase } from '../courses/lessons/comments/create-comment'

export function makeCreateCommentLessonCourseUseCase() {
	const lessonRepository = new PrismaLessonRepository()
	const commentRepository = new PrismaCommentRepository()
	const useCase = new CreateCommentLessonUseCase(
		lessonRepository,
		commentRepository
	)

	return useCase
}
