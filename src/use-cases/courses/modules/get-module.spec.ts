import { randomUUID } from 'node:crypto'
import { expect, describe, it, beforeEach } from 'vitest'

import { InMemoryModulesRepository } from '../../../repositories/in-memory/in-memory-modules-repository'

import { GetModuleUseCase } from './get-module'

let moduleRepository: InMemoryModulesRepository
let sut: GetModuleUseCase

describe('Get Module Use Case', () => {
	beforeEach(() => {
		moduleRepository = new InMemoryModulesRepository()
		sut = new GetModuleUseCase(moduleRepository)
	})

	it('should be able to get module details', async () => {
		const { id } = await moduleRepository.create({
			title: 'Module 1',
			slug: 'module-1',
			visibility: true,
			available: '2024-10-22',
			description: 'Teste 2',
			courseId: randomUUID()
		})

		const { module } = await sut.execute({
			id
		})

		expect(module?.id).toEqual(expect.any(String))
		expect(module?.title).toBe('Module 1')
	})
})
