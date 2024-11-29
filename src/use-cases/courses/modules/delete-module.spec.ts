import { randomUUID } from 'node:crypto'
import { expect, describe, it, beforeEach } from 'vitest'

import { InMemoryModulesRepository } from '../../../repositories/in-memory/in-memory-modules-repository'
import { InMemoryCoursesRepository } from '../../../repositories/in-memory/in-memory-courses-repository'

import { DeleteModuleUseCase } from './delete-module'

let courseRepository: InMemoryCoursesRepository
let moduleRepository: InMemoryModulesRepository
let sut: DeleteModuleUseCase

describe('Delete Module Use Case', () => {
	beforeEach(() => {
		courseRepository = new InMemoryCoursesRepository()
		moduleRepository = new InMemoryModulesRepository()
		sut = new DeleteModuleUseCase(moduleRepository)
	})

	it('should be able to delete module of this course', async () => {
		const course = await courseRepository.create({
			title: 'teste',
			slug: 'test',
			type: '',
			description: '',
			userId: randomUUID(),
			level: 'medium'
		})

		const { id } = await moduleRepository.create({
			title: 'Module 1',
			slug: 'module-1',
			visibility: true,
			available: '2024-10-20',
			description: 'Teste',
			courseId: course.id
		})

		await sut.execute({
			id
		})

		const moduleDeleted = await moduleRepository.findById(id)

		expect(moduleDeleted).toBe(null)
	})
})
