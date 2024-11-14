import { CourseEnrollment } from '@prisma/client'

export interface CourseEnrollmentsRepository {
	enrollUserInCourse(
		userId: string,
		courseId: string
	): Promise<CourseEnrollment>
	findUserInCourse(
		userId: string,
		courseId: string
	): Promise<CourseEnrollment | null>
	unenrollUserFromCourse(userId: string, courseId: string): Promise<void>
	findCoursesByUser(userId: string): Promise<CourseEnrollment[]>
	findUsersByCourse(
		courseId: string,
		take: number,
		skip: number
	): Promise<CourseEnrollment[]>
}
