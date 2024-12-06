import { CourseEnrollment } from '@prisma/client'
import type { CourseEnrollmentsRepository } from '../enrollments-repository'
import { prisma } from '../../lib/prisma'

export class PrismaCourseEnrollmentsRepository
	implements CourseEnrollmentsRepository
{
	async enrollUserInCourse(
		userId: string,
		courseId: string
	): Promise<CourseEnrollment> {
		const enrollment = await prisma.courseEnrollment.create({
			data: {
				userId,
				courseId,
				enrolledAt: new Date()
			}
		})

		return enrollment
	}

	async findUserInCourse(
		userId: string,
		courseId: string
	): Promise<CourseEnrollment | null> {
		return await prisma.courseEnrollment.findFirst({
			where: {
				userId,
				courseId
			}
		})
	}

	async unenrollUserFromCourse(
		userId: string,
		courseId: string
	): Promise<void> {
		await prisma.courseEnrollment.deleteMany({
			where: {
				userId,
				courseId
			}
		})
	}

	async findCoursesByUser(userId: string): Promise<CourseEnrollment[]> {
		return prisma.courseEnrollment.findMany({
			where: {
				userId
			},
			include: {
				course: true
			}
		})
	}

	async findUsersByCourse(
		courseId: string,
		take: number,
		skip: number
	): Promise<CourseEnrollment[]> {
		return prisma.courseEnrollment.findMany({
			where: {
				courseId
			},

			include: {
				user: {
					select: {
						id: true,
						name: true,
						username: true,
						avatar: true
					}
				}
			},
			take,
			skip
		})
	}
}
