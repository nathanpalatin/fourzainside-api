import { expect, describe, it, beforeEach } from 'vitest'

import { CreatModuleUseCase } from './create-module'
import { InMemoryModulesRepository } from '../../../repositories/in-memory/in-memory-modules-repository'
import { randomUUID } from 'node:crypto'

let moduleRepository: InMemoryModulesRepository
let sut: CreatModuleUseCase

describe('Module Use Case', () => {
	beforeEach(() => {
		moduleRepository = new InMemoryModulesRepository()
		sut = new CreatModuleUseCase(moduleRepository)
	})

	it('should be able to create a course', async () => {
		const { module } = await sut.execute({
			title: 'teste',
			slug: 'teste',
			available: '2024-11-25',
			visibility: true,
			courseId: randomUUID(),
			description: 'testeeee'
		})

		expect(module.id).toEqual(expect.any(String))
	})
})
