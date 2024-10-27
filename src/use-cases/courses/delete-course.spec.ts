import { expect, describe, it, beforeEach } from 'vitest'

import { randomUUID } from 'crypto'
import { InMemoryCoursesRepository } from '../../repositories/in-memory/in-memory-courses-repository'
import { DeleteCourseUseCase } from './delete-course'

let lessonRepository: InMemoryCoursesRepository
let sut: DeleteCourseUseCase

describe('Delete course Use Case', () => {
	beforeEach(() => {
		lessonRepository = new InMemoryCoursesRepository()
		sut = new DeleteCourseUseCase(lessonRepository)
	})

	it('should be able to delete a course', async () => {
		const { course } = await sut.execute({ courseId: randomUUID() })

		expect(course).toBe(null)
	})
})
