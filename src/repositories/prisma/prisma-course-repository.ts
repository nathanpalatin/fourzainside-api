import { Prisma } from '@prisma/client'

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
	async create(data: Prisma.CoursesCreateInput) {
		const course = await prisma.courses.create({
			data: {
				...data,
				user: { connect: { id: data.user.connect?.id } },
				tags: data.tags ?? []
			}
		})
		return course
	}

	async findMany(userId: string) {
		const courses = await prisma.courses.findMany({
			orderBy: {
				createdAt: 'desc'
			},
			where: {
				userId
			},
			include: {
				lessons: {
					orderBy: {
						createdAt: 'desc'
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
