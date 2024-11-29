import { Prisma, type Courses } from '@prisma/client'

import { prisma } from '../../lib/prisma'

import type { CoursesRepository } from '../courses-repository'

export class PrismaCourseRepository implements CoursesRepository {
	async findById(id: string) {
		const course = await prisma.courses.findUnique({
			where: {
				id
			}
		})
		return course
	}

	async findBySlug(slug: string) {
		const course = await prisma.courses.findFirst({
			where: {
				slug
			},
			include: {
				user: {
					select: {
						role: true,
						name: true,
						username: true,
						avatar: true
					}
				}
			}
		})
		return course
	}

	async create(data: Prisma.CoursesUncheckedCreateInput) {
		const course = await prisma.courses.create({
			data
		})
		return course
	}
	async findMany(userId: string, role: string) {
		const courses = await prisma.courses.findMany({
			orderBy: {
				createdAt: 'desc'
			},
			where:
				role === 'ADMIN'
					? {}
					: {
							OR: [
								{ userId },
								{
									courseEnrollment: {
										some: {
											userId: userId
										}
									}
								}
							]
						},
			include: {
				user: {
					select: {
						role: true,
						name: true,
						username: true,
						avatar: true
					}
				}
			}
		})

		return courses
	}

	async delete(id: string) {
		const course = await prisma.courses.delete({
			where: {
				id
			}
		})
		return course
	}
}
