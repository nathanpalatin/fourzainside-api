import { PrismaLessonRepository } from '../../repositories/prisma/prisma-lesson-repository'
import { DeleteLessonUseCase } from '../courses/lessons/delete-lesson'

export function makeDeleteLessonUseCase() {
	const prismaRepository = new PrismaLessonRepository()
	const useCase = new DeleteLessonUseCase(prismaRepository)

	return useCase
}
