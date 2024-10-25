import type { Lessons } from '@prisma/client'

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
export interface ListLessonUseCaseResponse {
	lessons: Lessons[]
}

export interface LessonDeleteUseCaseResponse {
	lesson: Lessons | null
}

export interface ListLessonsUseCaseResponse {
	lessons: Lessons[]
}
