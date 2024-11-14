import { CourseEnrollment } from '@prisma/client'

import type { CourseEnrollmentsRepository } from '../../repositories/enrollments-repository'

interface GetUserCourseUseCaseRequest {
	courseId: string
	take: number
	skip: number
}

interface GetUsersCourseUseCaseResponse {
	students: CourseEnrollment[] | null
}

export class GetUsersCourseUseCase {
	constructor(private enrollmentsRepository: CourseEnrollmentsRepository) {}

	async execute({
		courseId,
		take,
		skip
	}: GetUserCourseUseCaseRequest): Promise<GetUsersCourseUseCaseResponse> {
		const students = await this.enrollmentsRepository.findUsersByCourse(
			courseId,
			take,
			skip
		)

		return {
			students
		}
	}
}
