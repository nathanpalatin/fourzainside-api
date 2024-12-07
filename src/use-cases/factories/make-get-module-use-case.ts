import { PrismaModuleRepository } from '../../repositories/prisma/prisma-module-repository'
import { GetModuleUseCase } from '../courses/modules/get-module'

export function makeGetModuleUseCase() {
	const moduleRepository = new PrismaModuleRepository()
	const useCase = new GetModuleUseCase(moduleRepository)

	return useCase
}
