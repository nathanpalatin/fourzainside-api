import { CourseEnrollment } from '@prisma/client'

import type { CourseEnrollmentsRepository } from '../../repositories/enrollments-repository'

interface GetUserCourseUseCaseRequest {
	courseId: string
}

interface GetUsersCourseUseCaseResponse {
	students: CourseEnrollment[] | null
}

export class GetUsersCourseUseCase {
	constructor(private enrollmentsRepository: CourseEnrollmentsRepository) {}

	async execute({
		courseId
	}: GetUserCourseUseCaseRequest): Promise<GetUsersCourseUseCaseResponse> {
		const students =
			await this.enrollmentsRepository.findUsersByCourse(courseId)

		return {
			students
		}
	}
}
