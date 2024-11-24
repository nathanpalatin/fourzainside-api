import { expect, describe, it, beforeEach } from 'vitest'
import { randomUUID } from 'node:crypto'
import { GetUsersCourseUseCase } from './get-users-from-course'
import { InMemoryCoursesRepository } from '../../repositories/in-memory/in-memory-courses-repository'
import { InMemoryCourseEnrollmentsRepository } from '../../repositories/in-memory/in-memory-enrollments-repository'

let enrollmentRepository: InMemoryCourseEnrollmentsRepository
let coursesRepository: InMemoryCoursesRepository
let sut: GetUsersCourseUseCase

describe('Get Course Use Case', () => {
	beforeEach(() => {
		enrollmentRepository = new InMemoryCourseEnrollmentsRepository()
		coursesRepository = new InMemoryCoursesRepository()
		sut = new GetUsersCourseUseCase(enrollmentRepository)
	})

	it('should be able to get all students from course', async () => {
		const userId = randomUUID()
		const course = await coursesRepository.create({
			tags: ['javascript', 'typescript'],
			type: 'online',
			title: 'Introduction to Programming',
			slug: 'intro-to-programming',
			image: 'image-url',
			userId,
			level: 'easy',
			description: 'Learn the basics of programming.'
		})

		await enrollmentRepository.enrollUserInCourse(userId, course.id)

		const students = await sut.execute({
			courseId: course.id,
			take: 10,
			skip: 0
		})

		expect(students).toEqual({
			students: expect.arrayContaining([
				expect.objectContaining({
					userId
				})
			])
		})
	})
})
