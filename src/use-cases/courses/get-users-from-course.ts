import { Users } from '@prisma/client'

import { UsersRepository } from '../../repositories/users-repository'

interface GetUserCourseUseCaseRequest {
	courseId: string
	take: number
	skip: number
}

interface GetUsersCourseUseCaseResponse {
	students: Users[] | null
}

export class GetUsersCourseUseCase {
	constructor(private usersRepository: UsersRepository) {}

	async execute({
		courseId,
		take,
		skip
	}: GetUserCourseUseCaseRequest): Promise<GetUsersCourseUseCaseResponse> {
		const students = await this.usersRepository.findMany(courseId, take, skip)

		return {
			students
		}
	}
}
