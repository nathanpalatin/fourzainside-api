import { randomUUID } from 'node:crypto'

import { Prisma, type Comments } from '@prisma/client'
import type { CommentsRepository } from '../comments-repository'

export class InMemoryCommentsRepository implements CommentsRepository {
	public items: Comments[] = []

	async create(data: Prisma.CommentsUncheckedCreateInput) {
		const comment = {
			...data,
			id: randomUUID(),
			answer: false,
			lessonId: randomUUID(),
			createdAt: new Date(),
			updatedAt: new Date()
		}

		this.items.push(comment)

		return comment
	}

	async findById(id: string) {
		const comment = this.items.find(item => item.id === id)

		if (!comment) {
			return null
		}

		return comment
	}
	async findMany(lessonId: string) {
		const comments = {
			...this.items,
			lessonId
		}

		return comments
	}

	async delete(id: string) {
		const comment = this.items.find(item => item.id === id)
		if (!comment) {
			return null
		}

		this.items = this.items.filter(item => item.id !== id)

		return comment
	}
}
