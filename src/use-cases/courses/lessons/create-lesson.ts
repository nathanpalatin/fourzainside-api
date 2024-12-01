import type {
	CreateLessonUseCaseResponse,
	LessonUseCaseRequest
} from '../../../@types/use-cases/lessons'
import type { LessonsRepository } from '../../../repositories/lessons-repository'
import { BadRequestError } from '../../../routes/_errors/bad-request-error'
import { createSlug } from '../../../utils/functions'

export class CreateLessonUseCase {
	constructor(private lessonRepository: LessonsRepository) {}

	async execute({
		title,
		description,
		video,
		moduleId,
		courseId
	}: LessonUseCaseRequest): Promise<CreateLessonUseCaseResponse> {
		const slug = createSlug(title)
		const lessonExists = await this.lessonRepository.findBySlug(slug)

		if (lessonExists) {
			throw new BadRequestError('Lesson with the same title already exists.')
		}

		const lesson = await this.lessonRepository.create({
			title,
			slug,
			description,
			video,
			moduleId,
			courseId
		})

		return {
			lesson
		}
	}
}
