import type { Courses } from '@prisma/client'

export interface CourseUseCaseRequest {
	title: string
	duration: number
	type: string
	description: string
	image: string
	tags: string[]
	level: string
	userId: string
}

export interface CourseUseCaseResponse {
	courses: Courses
}
