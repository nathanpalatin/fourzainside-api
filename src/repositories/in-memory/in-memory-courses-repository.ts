import { randomUUID } from 'node:crypto'

import { Prisma, type Courses } from '@prisma/client'
import type { CoursesRepository } from '../courses-repository'

export class InMemoryCoursesRepository implements CoursesRepository {
	public items: Courses[] = []

	async create(data: Prisma.CoursesCreateInput) {
		const course = {
			id: randomUUID(),
			tags: Array.isArray(data.tags) ? data.tags : [],
			type: data.type,
			title: data.title,
			image: data.image,
			level: data.level ?? 'easy',
			duration: data.duration,
			description: data.description,
			createdAt: new Date(),
			updatedAt: new Date()
		}

		return course
	}
}
