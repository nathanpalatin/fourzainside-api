import { CourseEnrollment } from '@prisma/client'

export interface CourseEnrollmentsRepository {
	enrollUserInCourse(
		userId: string,
		courseId: string
	): Promise<CourseEnrollment>
	unenrollUserFromCourse(userId: string, courseId: string): Promise<void>
	findCoursesByUser(userId: string): Promise<CourseEnrollment[]>
	findUsersByCourse(courseId: string): Promise<CourseEnrollment[]>
}
