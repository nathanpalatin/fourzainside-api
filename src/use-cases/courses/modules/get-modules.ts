import type { Modules } from '@prisma/client'
import type { ModulesRepository } from '../../../repositories/modules-repository'
import { BadRequestError } from '../../../routes/_errors/bad-request-error'
import type { CoursesRepository } from '../../../repositories/courses-repository'

export interface ModuleUseCaseRequest {
	courseId: string
}
interface ModuleUseCaseResponse {
	modules: Modules[] | null
}

export class GetModulesUseCase {
	constructor(
		private courseRepository: CoursesRepository,
		private moduleRepository: ModulesRepository
	) {}

	async execute({
		courseId
	}: ModuleUseCaseRequest): Promise<ModuleUseCaseResponse> {
		const courseExists = await this.courseRepository.findById(courseId)
		if (!courseExists) {
			throw new BadRequestError('Course not found')
		}
		const modules = await this.moduleRepository.findMany(courseId)

		return { modules }
	}
}
