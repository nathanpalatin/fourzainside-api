import type { Modules } from '@prisma/client'
import type { ModulesRepository } from '../../../repositories/modules-repository'
import { BadRequestError } from '../../../routes/_errors/bad-request-error'
import type { CoursesRepository } from '../../../repositories/courses-repository'

export interface ModuleUseCaseRequest {
	courseId?: string
	slug?: string
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
		courseId,
		slug
	}: ModuleUseCaseRequest): Promise<ModuleUseCaseResponse> {
		let courseExists = null

		if (courseId) {
			courseExists = await this.courseRepository.findById(courseId)
		}

		if (!courseExists && slug) {
			courseExists = await this.courseRepository.findBySlug(slug)
		}

		let modules: Modules[] | null = null

		if (courseId) {
			modules = await this.moduleRepository.findMany(courseId)
		}

		if (!courseId && slug) {
			modules = await this.moduleRepository.findManyBySlug(slug)
		}

		if (!modules) {
			throw new BadRequestError('No modules found for the given course')
		}

		return { modules }
	}
}
