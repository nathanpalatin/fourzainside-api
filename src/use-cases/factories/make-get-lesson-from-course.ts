import { PrismaCourseRepository } from '../../repositories/prisma/prisma-course-repository'
import { PrismaLessonRepository } from '../../repositories/prisma/prisma-lesson-repository'
import { PrismaModuleRepository } from '../../repositories/prisma/prisma-module-repository'

import { GetLessonsCourseUseCase } from '../courses/lessons/get-lessons'

export function makeGetLessonsCourseUseCase() {
	const courseRepository = new PrismaCourseRepository()
	const moduleRepository = new PrismaModuleRepository()
	const lessonRepository = new PrismaLessonRepository()

	const useCase = new GetLessonsCourseUseCase(
		courseRepository,
		moduleRepository,
		lessonRepository
	)

	return useCase
}
