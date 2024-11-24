import { CoursesRepository } from '../../../repositories/courses-repository'
import { LessonsRepository } from '../../../repositories/lessons-repository'
import { ModulesRepository } from '../../../repositories/modules-repository'

import { OneLessonUseCaseResponse } from '../../../@types/use-cases/lessons'

import { BadRequestError } from '../../../routes/_errors/bad-request-error'

interface OneLessonUseCaseRequest {
	courseSlug: string
	moduleSlug: string
	slug: string
}

export class GetLessonUseCase {
	constructor(
		private courseRepository: CoursesRepository,
		private moduleRepository: ModulesRepository,
		private lessonRepository: LessonsRepository
	) {}

	async execute({
		courseSlug,
		moduleSlug,
		slug
	}: OneLessonUseCaseRequest): Promise<OneLessonUseCaseResponse> {
		const course = await this.courseRepository.findBySlug(courseSlug)

		if (!course) {
			throw new BadRequestError('Course not found.')
		}

		const module = await this.moduleRepository.findBySlug(moduleSlug)

		if (!module) {
			throw new BadRequestError('Module not found.')
		}

		const lesson = await this.lessonRepository.findBySlug(slug)

		if (!lesson) {
			throw new BadRequestError('Lesson not found.')
		}
		return {
			lesson
		}
	}
}
