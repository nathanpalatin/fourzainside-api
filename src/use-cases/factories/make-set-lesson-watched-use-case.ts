import { PrismaProgressRepository } from '../../repositories/in-memory/in-memory-progress-repository'
import { SetWatchedLessonUseCase } from '../courses/lessons/set-watched-lesson'

export function makeProgressUseCase() {
	const progressRepository = new PrismaProgressRepository()
	const useCase = new SetWatchedLessonUseCase(progressRepository)

	return useCase
}
