import type {
	LessonUseCaseRequest,
	LessonUseCaseResponse
} from '../../../@types/use-cases/lessons'
import type { LessonsRepository } from '../../../repositories/lessons-repository'

export class CreateCommentLessonUseCase {
	constructor(private lessonRepository: LessonsRepository) {}

	async execute({
		title,
		description,
		duration,
		video,
		courseId
	}: LessonUseCaseRequest): Promise<LessonUseCaseResponse> {
		const lessons = await this.lessonRepository.create({
			title,
			description,
			duration,
			video,
			course: {
				connect: { id: courseId }
			},
			createdAt: new Date(),
			updatedAt: new Date()
		})

		return {
			lessons
		}
	}
}
