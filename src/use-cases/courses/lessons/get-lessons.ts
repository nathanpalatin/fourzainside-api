import type {
	LessonUseCaseResponse,
	ListLessonsFromCourseUseCaseRequest,
	ListLessonsUseCaseResponse
} from '../../../@types/use-cases/lessons'
import type { LessonsRepository } from '../../../repositories/lessons-repository'

export class GetLessonsCourseUseCase {
	constructor(private lessonRepository: LessonsRepository) {}

	async execute({
		courseId
	}: ListLessonsFromCourseUseCaseRequest): Promise<ListLessonsUseCaseResponse> {
		const lessons = await this.lessonRepository.findMany(courseId)
		return {
			lessons
		}
	}
}
