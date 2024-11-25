import type { Courses } from '@prisma/client'

export interface CourseUseCaseRequest {
	title: string
	type: string
	description: string
	tags: string[]
	level: string
	userId: string
}

export interface DeleteCourseUseCaseRequest {
	courseId: string
}

export interface ListCoursesUseCaseRequest {
	userId: string
	role: string
}

export interface CourseUseCaseResponse {
	course: Courses
}

export interface DeleteCourseUseCaseResponse {
	course: Courses | null
}

export interface ListCoursesUseCaseResponse {
	courses: Courses[]
}
