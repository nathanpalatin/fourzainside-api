import { randomUUID } from 'node:crypto'

import { Prisma, Materials } from '@prisma/client'
import type { MaterialsRepository } from '../materials-repository'

export class InMemoryMaterialsRepository implements MaterialsRepository {
	public items: Materials[] = []

	async create(data: Prisma.MaterialsUncheckedCreateInput) {
		const file = {
			...data,
			id: randomUUID(),
			title: data.title ?? '',
			description: data.description ?? '',
			createdAt: new Date()
		}

		this.items.push(file)
		return file
	}

	async findById(id: string) {
		const file = this.items.find(item => item.id === id)

		if (!file) {
			return null
		}

		return file
	}
	async findMany(lessonId: string) {
		const files = {
			...this.items,
			lessonId
		}

		return files
	}

	async delete(id: string) {
		this.items = this.items.filter(item => item.id !== id)
	}
}
