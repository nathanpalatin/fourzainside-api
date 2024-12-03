import { Prisma } from '@prisma/client'

import { prisma } from '../../lib/prisma'

import type { MaterialsRepository } from '../materials-repository'

export class PrismaMaterialsRepository implements MaterialsRepository {
	async findById(id: string) {
		const file = await prisma.materials.findUnique({
			where: {
				id
			}
		})
		return file
	}
	async create(data: Prisma.MaterialsUncheckedCreateInput) {
		const file = await prisma.materials.create({
			data
		})

		return file
	}

	async findMany(lessonId: string) {
		const files = await prisma.materials.findMany({
			orderBy: {
				createdAt: 'desc'
			},
			where: {
				lessonId
			}
		})

		return files
	}

	async delete(id: string) {
		await prisma.materials.delete({
			where: {
				id
			}
		})
	}
}
