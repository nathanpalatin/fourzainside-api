import { expect, describe, it, beforeEach } from 'vitest'

import { InMemoryLessonsRepository } from '../../../repositories/in-memory/in-memory-lessons-repository'
import { DeleteLessonUseCase } from './delete-lesson'
import { randomUUID } from 'crypto'

let lessonRepository: InMemoryLessonsRepository
let sut: DeleteLessonUseCase

describe('Delete Lesson Use Case', () => {
	beforeEach(() => {
		lessonRepository = new InMemoryLessonsRepository()
		sut = new DeleteLessonUseCase(lessonRepository)
	})

	it('should be able to delete a lesson', async () => {
		const lessonCreated = await lessonRepository.create({
			title: 'Teste',
			video: 'video.mp4',
			courseId: randomUUID(),
			moduleId: randomUUID(),
			slug: 'test',
			description: 'Test'
		})

		await sut.execute({ lessonId: lessonCreated.id })

		const lesson = await lessonRepository.findById(lessonCreated.id)

		expect(lesson).toBeNull()
	})
})
