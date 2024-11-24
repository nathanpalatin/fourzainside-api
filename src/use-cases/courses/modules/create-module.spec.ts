import { expect, describe, it, beforeEach } from 'vitest'

import { CreateModuleUseCase } from './create-module'
import { InMemoryModulesRepository } from '../../../repositories/in-memory/in-memory-modules-repository'
import { randomUUID } from 'node:crypto'
import { InMemoryCoursesRepository } from '../../../repositories/in-memory/in-memory-courses-repository'

let courseRepository: InMemoryCoursesRepository
let moduleRepository: InMemoryModulesRepository
let sut: CreateModuleUseCase

describe('Module Use Case', () => {
	beforeEach(() => {
		courseRepository = new InMemoryCoursesRepository()
		moduleRepository = new InMemoryModulesRepository()
		sut = new CreateModuleUseCase(courseRepository, moduleRepository)
	})

	it('should be able to create a course', async () => {
		const course = await courseRepository.create({
			title: 'teste',
			slug: 'test',
			type: '',
			image: '',
			description: '',
			userId: randomUUID(),
			level: 'medium'
		})

		const { module } = await sut.execute({
			title: 'teste',
			available: '2024-11-25',
			visibility: true,
			courseId: course.id,
			description: 'testeeee'
		})

		expect(module.id).toEqual(expect.any(String))
	})
})
