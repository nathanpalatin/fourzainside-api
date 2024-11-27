import { randomUUID } from 'node:crypto'

import { Prisma, type Courses } from '@prisma/client'
import type { CoursesRepository } from '../courses-repository'

export class InMemoryCoursesRepository implements CoursesRepository {
	public items: Courses[] = []

	async findById(id: string) {
		const course = this.items.find(item => item.id === id)
		return course || null
	}

	async findBySlug(slug: string) {
		const course = this.items.find(item => item.slug === slug)
		return course || null
	}

	async create(data: Prisma.CoursesUncheckedCreateInput) {
		const course = {
			id: randomUUID(),
			tags: Array.isArray(data.tags) ? data.tags : [],
			type: data.type,
			image: data.image ?? '',
			title: data.title,
			slug: data.slug,
			userId: data.userId,
			status: data.status ?? '',
			level: data.level ?? 'beginner',
			description: data.description,
			createdAt: new Date(),
			updatedAt: new Date()
		}

		this.items.push(course)

		return course
	}
	async findMany(userId: string) {
		const courses = {
			...this.items,
			userId
		}

		return courses
	}

	async delete(id: string) {
		const course = this.items.find(item => item.id === id)
		if (!course) {
			return null
		}

		this.items = this.items.filter(item => item.id !== id)

		return course
	}
}
