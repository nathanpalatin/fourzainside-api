import { PrismaModuleRepository } from '../../repositories/prisma/prisma-module-repository'

import { DeleteModuleUseCase } from '../courses/modules/delete-module'

export function makeDeleteModuleUseCase() {
	const prismaRepository = new PrismaModuleRepository()
	const useCase = new DeleteModuleUseCase(prismaRepository)

	return useCase
}
