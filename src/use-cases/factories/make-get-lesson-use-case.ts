import { PrismaLessonRepository } from '../../repositories/prisma/prisma-lesson-repository'
import { GetLessonUseCase } from '../courses/lessons/get-lesson'

export function makeGetLessonCourseUseCase() {
	const lessonRepository = new PrismaLessonRepository()
	const useCase = new GetLessonUseCase(lessonRepository)

	return useCase
}
