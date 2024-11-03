import { PrismaClient, CourseEnrollment } from '@prisma/client'
import type { CourseEnrollmentsRepository } from '../enrollments-repository'

export class PrismaCourseEnrollmentsRepository
	implements CourseEnrollmentsRepository
{
	private prisma: PrismaClient

	constructor(prisma: PrismaClient) {
		this.prisma = prisma
	}

	async enrollUserInCourse(
		userId: string,
		courseId: string
	): Promise<CourseEnrollment> {
		const enrollment = await this.prisma.courseEnrollment.create({
			data: {
				userId,
				courseId,
				enrolledAt: new Date()
			}
		})

		return enrollment
	}

	async unenrollUserFromCourse(
		userId: string,
		courseId: string
	): Promise<void> {
		await this.prisma.courseEnrollment.deleteMany({
			where: {
				userId,
				courseId
			}
		})
	}

	async findCoursesByUser(userId: string): Promise<CourseEnrollment[]> {
		return this.prisma.courseEnrollment.findMany({
			where: {
				userId
			},
			include: {
				course: true
			}
		})
	}

	async findUsersByCourse(courseId: string): Promise<CourseEnrollment[]> {
		return this.prisma.courseEnrollment.findMany({
			where: {
				courseId
			},
			include: {
				user: true
			}
		})
	}
}
