import { randomUUID } from 'node:crypto'
import { Prisma, type Lessons } from '@prisma/client'
import type { LessonsRepository } from '../lessons-repository'

export class InMemoryLessonsRepository implements LessonsRepository {
	public items: Lessons[] = []

	async create(data: Prisma.LessonsUncheckedCreateInput) {
		const lesson: Lessons = {
			...data,
			id: randomUUID(),
			cover: data.cover ?? '',
			transcription: data.transcription ?? '',
			courseId: data.courseId ?? randomUUID(),
			createdAt: new Date(),
			updatedAt: new Date()
		}

		this.items.push(lesson)

		return lesson
	}

	async findById(id: string) {
		return this.items.find(item => item.id === id) || null
	}

	async findBySlug(slug: string) {
		return this.items.find(item => item.slug === slug) || null
	}

	async findMany(slug?: string) {
		if (slug) {
			return this.items.filter(item => item.slug === slug) || null
		}
		return this.items
	}

	async delete(id: string) {
		const lessonIndex = this.items.findIndex(item => item.id === id)

		if (lessonIndex === -1) {
			return null
		}

		const [deletedLesson] = this.items.splice(lessonIndex, 1)

		return deletedLesson
	}

	async update(id: string, data: Prisma.LessonsUpdateInput) {
		const lessonIndex = this.items.findIndex(item => item.id === id)
		if (lessonIndex === -1) {
			return null
		}

		const updatedLesson: Lessons = {
			...data,
			...this.items[lessonIndex]
		}

		this.items[lessonIndex] = updatedLesson
		return updatedLesson
	}
}
