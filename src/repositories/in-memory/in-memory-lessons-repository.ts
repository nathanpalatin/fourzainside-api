import { randomUUID } from 'node:crypto'
import { Prisma, type Lessons } from '@prisma/client'
import type { LessonsRepository } from '../lessons-repository'

export class InMemoryLessonsRepository implements LessonsRepository {
	public items: Lessons[] = []

	async create(data: Prisma.LessonsCreateInput) {
		const lesson = {
			...data,
			id: randomUUID(),
			watched: false,
			transcription: data.transcription ?? '',
			classification: data.classification ?? 0,
			courseId: randomUUID(),
			createdAt: new Date(),
			updatedAt: new Date()
		}

		this.items.push(lesson)
		return lesson
	}

	async findById(id: string) {
		return this.items.find(item => item.id === id) || null
	}

	async findMany() {
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

	async update(id: string, data: Partial<Lessons>) {
		const lessonIndex = this.items.findIndex(item => item.id === id)
		if (lessonIndex === -1) {
			return null
		}

		this.items[lessonIndex] = {
			...this.items[lessonIndex],
			...data,
			updatedAt: new Date()
		}

		return this.items[lessonIndex]
	}
}
