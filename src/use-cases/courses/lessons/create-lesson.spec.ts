import { expect, describe, it, beforeEach } from 'vitest'

import { randomUUID } from 'crypto'
import { CreateLessonUseCase } from './create-lesson'
import { InMemoryLessonsRepository } from '../../../repositories/in-memory/in-memory-lessons-repository'

let lessonRepository: InMemoryLessonsRepository
let sut: CreateLessonUseCase

describe('Lesson Use Case', () => {
	beforeEach(() => {
		lessonRepository = new InMemoryLessonsRepository()
		sut = new CreateLessonUseCase(lessonRepository)
	})

	it('should be able to create a lesson', async () => {
		const { lesson } = await sut.execute({
			title: 'teste',
			video: 'video.mp4',
			courseId: randomUUID(),
			moduleId: randomUUID(),
			description: 'testeeee'
		})

		expect(lesson.id).toEqual(expect.any(String))
	})
})
