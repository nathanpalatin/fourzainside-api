import { createSlug } from '../../../utils/functions'

import {
	ModuleUseCaseRequest,
	ModuleUseCaseResponse
} from '../../../@types/use-cases/modules'

import type { ModulesRepository } from '../../../repositories/modules-repository'

export class CreatModuleUseCase {
	constructor(private moduleRepository: ModulesRepository) {}

	async execute({
		title,
		description,
		available,
		visibility,
		courseId
	}: ModuleUseCaseRequest): Promise<ModuleUseCaseResponse> {
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
