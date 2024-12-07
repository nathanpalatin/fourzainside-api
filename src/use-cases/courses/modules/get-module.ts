import { Modules } from '@prisma/client'
import { ModulesRepository } from '../../../repositories/modules-repository'
import { BadRequestError } from '../../../routes/_errors/bad-request-error'

export interface ModuleUseCaseRequest {
	id: string
}
interface ModuleUseCaseResponse {
	module: Modules | null
}

export class GetModuleUseCase {
	constructor(private moduleRepository: ModulesRepository) {}

	async execute({ id }: ModuleUseCaseRequest): Promise<ModuleUseCaseResponse> {
		const module = await this.moduleRepository.findById(id)

		if (!module) {
			throw new BadRequestError('Module not found')
		}

		return { module }
	}
}
