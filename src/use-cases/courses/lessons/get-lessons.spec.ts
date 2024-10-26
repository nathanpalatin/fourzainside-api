import { expect, describe, it, beforeEach } from 'vitest'

import { InMemoryLessonsRepository } from '../../../repositories/in-memory/in-memory-lessons-repository'
import { randomUUID } from 'crypto'
import { GetLessonsCourseUseCase } from './get-lessons'

let lessonRepository: InMemoryLessonsRepository
let sut: GetLessonsCourseUseCase

describe('Get Lessons Use Case', () => {
	beforeEach(() => {
		lessonRepository = new InMemoryLessonsRepository()
		sut = new GetLessonsCourseUseCase(lessonRepository)
	})

	it('should be able to list all lessons from course', async () => {
		const courseId = randomUUID()
		const { lessons } = await sut.execute({ courseId })

		expect(lessons).toBeGreaterThanOrEqual(0)
	})
})
