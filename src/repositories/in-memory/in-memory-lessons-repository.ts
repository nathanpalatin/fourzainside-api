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
	async findMany(userId: string) {
		const lessons = {
			...this.items,
			userId
		}

		return lessons
	}

	async delete(id: string) {
		const lesson = this.items.find(item => item.id === id)
		if (!lesson) {
			return null
		}

		this.items = this.items.filter(item => item.id !== id)

		return lesson
	}
}
