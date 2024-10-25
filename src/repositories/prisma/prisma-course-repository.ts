import { Prisma, type Courses } from '@prisma/client'

import { prisma } from '../../lib/prisma'
import type { CoursesRepository } from '../courses-repository'

export class PrismaCourseRepository implements CoursesRepository {
	async create(data: Prisma.CoursesCreateInput): Promise<Courses> {
		const course = await prisma.courses.create({
			data: {
				...data,
				user: { connect: { id: data.user.connect?.id } },
				tags: data.tags ?? []
			}
		})
		return course
	}

	async findMany(userId: string): Promise<Courses[]> {
		const courses = await prisma.courses.findMany({
			orderBy: {
				createdAt: 'desc'
			},
			where: {
				userId
			}
		})

		return courses
	}
}
