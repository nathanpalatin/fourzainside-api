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
		const { courses } = await sut.execute({
			title: 'teste',
			description: 'testeeee',
			level: 'medium',
			userId: randomUUID(),
			image: 'course.png',
			type: 'Finance',
			tags: ['tag1', 'tag2'],
			duration: 10
		})

		expect(courses.id).toEqual(expect.any(String))
	})
})
