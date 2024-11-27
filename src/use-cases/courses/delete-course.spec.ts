import { expect, describe, it, beforeEach } from 'vitest'

import { randomUUID } from 'crypto'
import { InMemoryCoursesRepository } from '../../repositories/in-memory/in-memory-courses-repository'
import { DeleteCourseUseCase } from './delete-course'

let courseRepository: InMemoryCoursesRepository
let sut: DeleteCourseUseCase

describe('Delete course Use Case', () => {
	beforeEach(() => {
		courseRepository = new InMemoryCoursesRepository()
		sut = new DeleteCourseUseCase(courseRepository)
	})

	it('should be able to delete a course', async () => {
		const course = await courseRepository.create({
			title: 'teste',
			slug: 'test',
			userId: randomUUID(),
			type: 'online',
			level: 'beginner',
			description: 'teste'
		})
		await sut.execute({ courseId: course.id })

		const courseDeleted = await courseRepository.findById(course.id)

		expect(courseDeleted).toBe(null)
	})
})
