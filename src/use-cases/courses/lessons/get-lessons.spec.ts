import { expect, describe, it, beforeEach } from 'vitest'

import { InMemoryLessonsRepository } from '../../../repositories/in-memory/in-memory-lessons-repository'
import { randomUUID } from 'crypto'
import { GetLessonsCourseUseCase } from './get-lessons'
import { InMemoryCoursesRepository } from '../../../repositories/in-memory/in-memory-courses-repository'
import { InMemoryModulesRepository } from '../../../repositories/in-memory/in-memory-modules-repository'

let moduleRepository: InMemoryModulesRepository
let courseRepository: InMemoryCoursesRepository
let lessonRepository: InMemoryLessonsRepository
let sut: GetLessonsCourseUseCase

describe('Get Lessons Use Case', () => {
	beforeEach(() => {
		moduleRepository = new InMemoryModulesRepository()
		lessonRepository = new InMemoryLessonsRepository()
		courseRepository = new InMemoryCoursesRepository()
		sut = new GetLessonsCourseUseCase(
			courseRepository,
			moduleRepository,
			lessonRepository
		)
	})

	it('should be able to list all lessons from course', async () => {
		const course = await courseRepository.create({
			title: 'Teste',
			slug: 'test',
			userId: randomUUID(),
			type: 'online',
			level: 'easy',
			tags: ['tag1', 'tag2'],
			description: 'Test'
		})

		const module = await moduleRepository.create({
			title: 'Teste',
			available: 'amanha',
			visibility: true,
			courseId: course.id,
			slug: 'test',
			description: 'Test'
		})

		await lessonRepository.create({
			title: 'Teste',
			courseId: course.id,
			video: 'video',
			moduleId: module.id,
			slug: 'test',
			description: 'Test'
		})

		const { lessons } = await sut.execute({
			courseSlug: course.slug,
			moduleSlug: module.slug
		})

		expect(lessons.length).toBeGreaterThanOrEqual(0)
	})
})
