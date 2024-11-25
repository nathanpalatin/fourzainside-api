import { expect, describe, it, beforeEach } from 'vitest'

import { InMemoryLessonsRepository } from '../../../repositories/in-memory/in-memory-lessons-repository'
import { randomUUID } from 'crypto'
import { GetLessonUseCase } from './get-lesson'
import { InMemoryCoursesRepository } from '../../../repositories/in-memory/in-memory-courses-repository'
import { InMemoryModulesRepository } from '../../../repositories/in-memory/in-memory-modules-repository'

let courseRepository: InMemoryCoursesRepository
let moduleRepository: InMemoryModulesRepository
let lessonRepository: InMemoryLessonsRepository
let sut: GetLessonUseCase

describe('Get Lesson Use Case', () => {
	beforeEach(() => {
		moduleRepository = new InMemoryModulesRepository()
		lessonRepository = new InMemoryLessonsRepository()
		courseRepository = new InMemoryCoursesRepository()
		sut = new GetLessonUseCase(
			courseRepository,
			moduleRepository,
			lessonRepository
		)
	})

	it('should be able to get lesson', async () => {
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

		const lessonCreated = await lessonRepository.create({
			title: 'Teste',
			courseId: course.id,
			video: 'video',
			moduleId: module.id,
			slug: 'test',
			description: 'Test'
		})

		const { lesson } = await sut.execute({
			courseSlug: course.slug,
			moduleSlug: module.slug,
			slug: lessonCreated.slug
		})

		expect(lesson.slug).toEqual(expect.any(String))
	})
})
