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
		video,
		moduleId,
		courseId
	}: LessonUseCaseRequest): Promise<CreateLessonUseCaseResponse> {
		const slug = createSlug(title)

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
