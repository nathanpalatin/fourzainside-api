import { createSlug } from '../../../utils/functions'

import {
	ModuleUseCaseRequest,
	ModuleUseCaseResponse
} from '../../../@types/use-cases/modules'

import type { ModulesRepository } from '../../../repositories/modules-repository'
import { BadRequestError } from '../../../routes/_errors/bad-request-error'
import type { CoursesRepository } from '../../../repositories/courses-repository'

export class CreateModuleUseCase {
	constructor(
		private courseRepository: CoursesRepository,
		private moduleRepository: ModulesRepository
	) {}

	async execute({
		title,
		description,
		available,
		visibility,
		courseId
	}: ModuleUseCaseRequest): Promise<ModuleUseCaseResponse> {
		const courseExists = await this.courseRepository.findById(courseId)
		if (!courseExists) {
			throw new BadRequestError('Course not found')
		}
		const module = await this.moduleRepository.create({
			title,
			slug: createSlug(title),
			description,
			available,
			visibility,
			courseId
		})

		return { module }
	}
}
