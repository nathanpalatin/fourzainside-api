import { expect, describe, it, beforeEach } from 'vitest'
import { randomUUID } from 'node:crypto'
import { InMemoryCoursesRepository } from '../../repositories/in-memory/in-memory-courses-repository'
import { GetCourseUseCase } from './get-one-course'

let coursesRepository: InMemoryCoursesRepository
let sut: GetCourseUseCase

describe('Get Course Use Case', () => {
	beforeEach(() => {
		coursesRepository = new InMemoryCoursesRepository()
		sut = new GetCourseUseCase(coursesRepository)
	})

	it('should be able to get course details', async () => {
		const course = await coursesRepository.create({
			tags: ['javascript', 'typescript'],
			type: 'online',
			title: 'Introduction to Programming',
			slug: 'intro-to-programming',
			image: 'image-url',
			userId: randomUUID(),
			level: 'easy',
			description: 'Learn the basics of programming.'
		})
		const courses = await sut.execute({
			slug: course.slug
		})

		expect(courses).toEqual({
			course: {
				...course,
				userId: expect.any(String)
			}
		})
	})
})
