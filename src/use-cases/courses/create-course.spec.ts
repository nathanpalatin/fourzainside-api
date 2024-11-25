import { expect, describe, it, beforeEach } from 'vitest'

import { randomUUID } from 'crypto'
import { InMemoryCoursesRepository } from '../../repositories/in-memory/in-memory-courses-repository'
import { CreateCourseUseCase } from './create-course'

let courseRepository: InMemoryCoursesRepository
let sut: CreateCourseUseCase

describe('Courses Use Case', () => {
	beforeEach(() => {
		courseRepository = new InMemoryCoursesRepository()
		sut = new CreateCourseUseCase(courseRepository)
	})

	it('should be able to create a course', async () => {
		const { course } = await sut.execute({
			title: 'teste',
			description: 'testeeee',
			level: 'medium',
			userId: randomUUID(),
			type: 'Finance',
			tags: ['tag1', 'tag2']
		})

		expect(course.id).toEqual(expect.any(String))
	})
})
