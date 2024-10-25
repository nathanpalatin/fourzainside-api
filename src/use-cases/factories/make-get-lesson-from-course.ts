import { PrismaLessonRepository } from '../../repositories/prisma/prisma-lesson-repository'
import { GetLessonsCourseUseCase } from '../courses/lessons/get-lessons'

export function makeGetLessonsCourseUseCase() {
	const lessonRepository = new PrismaLessonRepository()
	const useCase = new GetLessonsCourseUseCase(lessonRepository)

	return useCase
}
