import { PrismaCourseRepository } from '../../repositories/prisma/prisma-course-repository'
import { PrismaModuleRepository } from '../../repositories/prisma/prisma-module-repository'
import { GetModulesUseCase } from '../courses/modules/get-modules'

export function makeGetModulesUseCase() {
	const courseRepository = new PrismaCourseRepository()
	const moduleRepository = new PrismaModuleRepository()
	const useCase = new GetModulesUseCase(courseRepository, moduleRepository)

	return useCase
}
