import { CourseEnrollment } from '@prisma/client'

import type { CourseEnrollmentsRepository } from '../../repositories/enrollments-repository'
import { StudentAlreadyEnrolledError } from '../errors/student-already-enrolled'

interface GetUserCourseUseCaseRequest {
	userId: string
	courseId: string
}

interface EnrollUsersCourseUseCaseResponse {
	enroll: CourseEnrollment
}

export class EnrollUserUseCase {
	constructor(private enrollmentsRepository: CourseEnrollmentsRepository) {}

	async execute({
		userId,
		courseId
	}: GetUserCourseUseCaseRequest): Promise<EnrollUsersCourseUseCaseResponse> {
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
