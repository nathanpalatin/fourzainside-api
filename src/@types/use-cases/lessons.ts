import type { Comments, Lessons, Progress } from '@prisma/client'

export interface LessonUseCaseRequest {
	title: string
	duration: number
	video: string
	description: string
	courseId: string
}

export interface LessonDeleteUseCaseRequest {
	lessonId: string
}

export interface ListLessonsUseCaseRequest {
	userId: string
}

export interface ListLessonsFromCourseUseCaseRequest {
	courseId: string
}

export interface LessonUseCaseResponse {
	lessons: Lessons
}

export interface LessonDeleteUseCaseResponse {
	lesson: Lessons | null
}

export interface LessonUpdateUseCaseResponse {
	progress: Progress | null
}

export interface ListLessonsUseCaseResponse {
	lessons: Lessons[]
}

export interface GetLessonUseCaseRequest {
	courseId: string
	userId: string
	lessonId: string
}

export interface ListCommentsUseCaseRequest {
	lessonId: string
}

export interface CreateCommentUseCaseRequest {
	lessonId: string
	content: string
	userId: string
	answer: boolean
}

export interface ListCommentsUseCaseResponse {
	comments: Comments[]
}

export interface CreateCommentUseCaseResponse {
	comment: Comments
}
