import { expect, describe, it, beforeEach } from 'vitest'
import { randomUUID } from 'crypto'
import { GetCourseByUserUseCase } from './get-courses-by-user'
import { InMemoryCoursesRepository } from '../../repositories/in-memory/in-memory-courses-repository'

let coursesRepository: InMemoryCoursesRepository
let sut: GetCourseByUserUseCase

describe('Get Courses by User Use Case', () => {
	beforeEach(() => {
		coursesRepository = new InMemoryCoursesRepository()
		sut = new GetCourseByUserUseCase(coursesRepository)
	})

	it('should be able to get all courses by user', async () => {
		const courses = await sut.execute({
			userId: randomUUID()
		})

		expect(courses).toEqual({
			courses: expect.any(Object)
		})
	})
})
