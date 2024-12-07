import { CourseEnrollment } from '@prisma/client'

import type { CourseEnrollmentsRepository } from '../../repositories/enrollments-repository'
import { StudentAlreadyEnrolledError } from '../errors/student-already-enrolled'
import type { CoursesRepository } from '../../repositories/courses-repository'
import { BadRequestError } from '../../routes/_errors/bad-request-error'
import type { UsersRepository } from '../../repositories/users-repository'

interface GetUserCourseUseCaseRequest {
	userId: string
	courseId: string
}

interface EnrollUsersCourseUseCaseResponse {
	enroll: CourseEnrollment
}

export class EnrollUserUseCase {
	constructor(
		private courseRepository: CoursesRepository,
		private userRepository: UsersRepository,
		private enrollmentsRepository: CourseEnrollmentsRepository
	) {}

	async execute({
		userId,
		courseId
	}: GetUserCourseUseCaseRequest): Promise<EnrollUsersCourseUseCaseResponse> {
		const userExists = await this.userRepository.findById(userId)
		const courseExists = await this.courseRepository.findById(courseId)

		if (!courseExists) {
			throw new BadRequestError('Course not found')
		}

		if (!userExists) {
			throw new BadRequestError('User not found')
		}

		const userEnrolled = await this.enrollmentsRepository.findUserInCourse(
			userId,
			courseId
		)

		if (userEnrolled) {
			throw new StudentAlreadyEnrolledError()
		}

		const enroll = await this.enrollmentsRepository.enrollUserInCourse(
			userId,
			courseId
		)

		return {
			enroll
		}
	}
}
