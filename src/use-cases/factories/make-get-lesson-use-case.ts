import { PrismaCourseRepository } from '../../repositories/prisma/prisma-course-repository'
import { PrismaLessonRepository } from '../../repositories/prisma/prisma-lesson-repository'
import { PrismaModuleRepository } from '../../repositories/prisma/prisma-module-repository'
import { GetLessonUseCase } from '../courses/lessons/get-lesson'

export function makeGetLessonCourseUseCase() {
	const courseRepository = new PrismaCourseRepository()
	const moduleRepository = new PrismaModuleRepository()
	const lessonRepository = new PrismaLessonRepository()
	const useCase = new GetLessonUseCase(
		courseRepository,
		moduleRepository,
		lessonRepository
	)

	return useCase
}
