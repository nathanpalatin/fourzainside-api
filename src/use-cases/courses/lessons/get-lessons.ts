import type { Lessons } from '@prisma/client'

import { BadRequestError } from '../../../routes/_errors/bad-request-error'

import type { CoursesRepository } from '../../../repositories/courses-repository'
import type { ModulesRepository } from '../../../repositories/modules-repository'
import type { LessonsRepository } from '../../../repositories/lessons-repository'
import type { LessonWithoutUpdatedAt } from '../../../repositories/prisma/prisma-lesson-repository'

interface ListLessonsFromCourseUseCaseRequest {
	courseSlug: string
	moduleSlug: string
}

interface ListLessonsUseCaseResponse {
	lessons: LessonWithoutUpdatedAt[]
}

export class GetLessonsCourseUseCase {
	constructor(
		private courseRepository: CoursesRepository,
		private moduleRepository: ModulesRepository,
		private lessonRepository: LessonsRepository
	) {}

	async execute({
		courseSlug,
		moduleSlug
	}: ListLessonsFromCourseUseCaseRequest): Promise<ListLessonsUseCaseResponse> {
		const course = await this.courseRepository.findBySlug(courseSlug)
		if (!course) {
			throw new BadRequestError('Course not found.')
		}
		const module = await this.moduleRepository.findBySlug(moduleSlug)

		if (!module) {
			throw new BadRequestError('Module not found.')
		}

		const lessons = await this.lessonRepository.findMany(module.slug)

		return { lessons }
	}
}
