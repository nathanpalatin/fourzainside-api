import { PrismaModuleRepository } from '../../repositories/prisma/prisma-module-repository'
import { CreatModuleUseCase } from '../courses/modules/create-module'

export function makeCreateModuleUseCase() {
	const moduleRepository = new PrismaModuleRepository()
	const useCase = new CreatModuleUseCase(moduleRepository)

	return useCase
}
