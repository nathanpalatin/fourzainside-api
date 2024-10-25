import { Prisma, type Courses } from '@prisma/client'

import { prisma } from '../../lib/prisma'
import type { CoursesRepository } from '../courses-repository'

export class PrismaCourseRepository implements CoursesRepository {
	async create(data: Prisma.CoursesCreateInput): Promise<Courses> {
		const course = await prisma.courses.create({
			data: {
				...data,
				tags: Array.isArray(data.tags) ? data.tags : []
			}
		})
		return course
	}
}
