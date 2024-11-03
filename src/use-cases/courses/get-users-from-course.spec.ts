import { expect, describe, it, beforeEach } from 'vitest'
import { randomUUID } from 'node:crypto'
import { GetUsersCourseUseCase } from './get-users-from-course'
import { InMemoryUsersRepository } from '../../repositories/in-memory/in-memory-users-repository'
import { InMemoryCoursesRepository } from '../../repositories/in-memory/in-memory-courses-repository'
import { hash } from 'bcrypt'
import { InMemoryCourseEnrollmentsRepository } from '../../repositories/in-memory/in-memory-enrollments-repository'

let enrollmentRepository: InMemoryCourseEnrollmentsRepository
let coursesRepository: InMemoryCoursesRepository
let userRepository: InMemoryUsersRepository
let sut: GetUsersCourseUseCase

describe('Get Course Use Case', () => {
	beforeEach(() => {
		enrollmentRepository = new InMemoryCourseEnrollmentsRepository()
		coursesRepository = new InMemoryCoursesRepository()
		userRepository = new InMemoryUsersRepository()
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
			duration: 120,
			description: 'Learn the basics of programming.'
		})

		const user = await userRepository.create({
			name: 'John Doe',
			password: await hash('123456', 1),
			username: 'johndoe',
			phone: '+554799999999999',
			cpf: '999.999.999-99',
			birthdate: '1993-06-14T00:00:00Z',
			email: 'johndoe@example.com'
		})

		await enrollmentRepository.enrollUserInCourse(user.id, course.id)

		const students = await sut.execute({
			courseId: course.id
		})

		expect(students).toEqual({
			students: expect.arrayContaining([
				expect.objectContaining({
					userId: user.id
				})
			])
		})
	})
})
