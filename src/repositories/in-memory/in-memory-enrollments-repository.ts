import { randomUUID } from 'node:crypto'

type CourseEnrollment = {
	id: string
	userId: string
	courseId: string
	enrolledAt: Date
}

export class InMemoryCourseEnrollmentsRepository {
	public items: CourseEnrollment[] = []

	async enrollUserInCourse(userId: string, courseId: string) {
		const existingEnrollment = this.items.find(
			enrollment =>
				enrollment.userId === userId && enrollment.courseId === courseId
		)

		if (existingEnrollment) {
			throw new Error('User is already enrolled in this course')
		}

		const enrollment: CourseEnrollment = {
			id: randomUUID(),
			userId,
			courseId,
			enrolledAt: new Date()
		}

		this.items.push(enrollment)
		return enrollment
	}

	async unenrollUserFromCourse(userId: string, courseId: string) {
		const enrollmentIndex = this.items.findIndex(
			enrollment =>
				enrollment.userId === userId && enrollment.courseId === courseId
		)

		if (enrollmentIndex === -1) {
			throw new Error('Enrollment not found')
		}

		this.items.splice(enrollmentIndex, 1)
	}

	async findCoursesByUser(userId: string) {
		return this.items.filter(enrollment => enrollment.userId === userId)
	}

	async findUsersByCourse(courseId: string) {
		return this.items.filter(enrollment => enrollment.courseId === courseId)
	}
}
