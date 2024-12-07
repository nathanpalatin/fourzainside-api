import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryCourseEnrollmentsRepository } from '../../repositories/in-memory/in-memory-enrollments-repository'
import { EnrollUserUseCase } from './insert-user-course'
import { InMemoryCoursesRepository } from '../../repositories/in-memory/in-memory-courses-repository'
import { randomUUID } from 'crypto'
import { InMemoryUsersRepository } from '../../repositories/in-memory/in-memory-users-repository'

let userRepository: InMemoryUsersRepository
let coursesRepository: InMemoryCoursesRepository
let enrollmentRepository: InMemoryCourseEnrollmentsRepository
let sut: EnrollUserUseCase

describe('Enrollment Use Case', () => {
	beforeEach(() => {
		coursesRepository = new InMemoryCoursesRepository()
		userRepository = new InMemoryUsersRepository()
		enrollmentRepository = new InMemoryCourseEnrollmentsRepository()
		sut = new EnrollUserUseCase(
			coursesRepository,
			userRepository,
			enrollmentRepository
		)
	})

	it('should be able to enroll an user at course.', async () => {
		const course = await coursesRepository.create({
			title: 'teste',
			slug: '',
			description: 'testeeee',
			level: 'medium',
			userId: randomUUID(),
			image: 'course.png',
			type: 'Finance',
			tags: ['tag1', 'tag2']
		})

		const user = await userRepository.create({
			name: 'John Doe',
			password: '123456',
			username: 'johndoe',
			phone: '+554799999999999',
			cpf: '999.999.999-99',
			birthdate: '1993-06-14T00:00:00Z',
			email: 'johndoe@example.com'
		})

		const { enroll } = await sut.execute({
			userId: user.id,
			courseId: course.id
		})

		if (!enroll) {
			throw new Error()
		}

		expect(enroll.id).toEqual(expect.any(String))
	})
})
