import { PrismaCourseRepository } from '../../repositories/prisma/prisma-course-repository'
import { PrismaModuleRepository } from '../../repositories/prisma/prisma-module-repository'
import { CreateModuleUseCase } from '../courses/modules/create-module'

export function makeCreateModuleUseCase() {
	const courseRepository = new PrismaCourseRepository()
	const moduleRepository = new PrismaModuleRepository()
	const useCase = new CreateModuleUseCase(courseRepository, moduleRepository)

	return useCase
}
