import { PrismaLessonRepository } from '../../repositories/prisma/prisma-lesson-repository'
import { CreateLessonUseCase } from '../courses/lessons/create-lesson'

export function makeCreateLessonUseCase() {
	const prismaRepository = new PrismaLessonRepository()
	const useCase = new CreateLessonUseCase(prismaRepository)

	return useCase
}
