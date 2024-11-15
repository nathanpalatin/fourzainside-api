import type {
	CreateLessonUseCaseResponse,
	LessonUseCaseRequest
} from '../../../@types/use-cases/lessons'
import type { LessonsRepository } from '../../../repositories/lessons-repository'
import { createSlug } from '../../../utils/functions'

export class CreateLessonUseCase {
	constructor(private lessonRepository: LessonsRepository) {}

	async execute({
		title,
		description,
		duration,
		video,
		courseId
	}: LessonUseCaseRequest): Promise<CreateLessonUseCaseResponse> {
		const lesson = await this.lessonRepository.create({
			title,
			slug: createSlug(title),
			description,
			duration,
			video,
			courseId,
			createdAt: new Date(),
			updatedAt: new Date()
		})

		return {
			lesson
		}
	}
}
