import { expect, describe, it, beforeEach } from 'vitest'

import { randomUUID } from 'crypto'
import { SetWatchedLessonUseCase } from './set-watched-lesson'
import { InMemoryProgressRepository } from '../../../repositories/in-memory/in-memory-progress-repository'

let progressRepository: InMemoryProgressRepository
let sut: SetWatchedLessonUseCase

describe('Watch Lesson Use Case', () => {
	beforeEach(() => {
		progressRepository = new InMemoryProgressRepository()
		sut = new SetWatchedLessonUseCase(progressRepository)
	})

	it('should be able to update watch lesson', async () => {})
})
