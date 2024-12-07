import { ModulesRepository } from '../../../repositories/modules-repository'
import { BadRequestError } from '../../../routes/_errors/bad-request-error'

interface ModuleUseCaseRequest {
	id: string
}

export class DeleteModuleUseCase {
	constructor(private moduleRepository: ModulesRepository) {}

	async execute({ id }: ModuleUseCaseRequest): Promise<void> {
		const courseExists = await this.moduleRepository.findById(id)
		if (!courseExists) {
			throw new BadRequestError('Course not found')
		}
		await this.moduleRepository.delete(id)
	}
}
