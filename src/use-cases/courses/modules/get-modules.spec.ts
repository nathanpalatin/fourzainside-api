import { randomUUID } from 'node:crypto'
import { expect, describe, it, beforeEach } from 'vitest'

import { InMemoryModulesRepository } from '../../../repositories/in-memory/in-memory-modules-repository'
import { InMemoryCoursesRepository } from '../../../repositories/in-memory/in-memory-courses-repository'

import { GetModulesUseCase } from './get-modules'

let courseRepository: InMemoryCoursesRepository
let moduleRepository: InMemoryModulesRepository
let sut: GetModulesUseCase

describe('Get Modules Use Case', () => {
	beforeEach(() => {
		courseRepository = new InMemoryCoursesRepository()
		moduleRepository = new InMemoryModulesRepository()
		sut = new GetModulesUseCase(courseRepository, moduleRepository)
	})

	it('should be able to list modules of this course', async () => {
		const course = await courseRepository.create({
			title: 'teste',
			slug: 'test',
			type: '',
			description: '',
			userId: randomUUID(),
			level: 'medium'
		})

		await moduleRepository.create({
			title: 'Module 1',
			slug: 'module-1',
			visibility: true,
			available: '2024-10-20',
			description: 'Teste',
			courseId: course.id
		})
		await moduleRepository.create({
			title: 'Module 2',
			slug: 'module-2',
			visibility: true,
			available: '2024-10-22',
			description: 'Teste 2',
			courseId: course.id
		})

		const { modules } = await sut.execute({
			courseId: course.id
		})

		expect(modules?.length).toBeGreaterThanOrEqual(0)
		expect(modules).toEqual(expect.any(Object))
	})
})
