import { Prisma, type Progress } from '@prisma/client'
import { prisma } from '../../lib/prisma'
import type { ProgressRepository } from '../progress-repository'

export class PrismaProgressRepository implements ProgressRepository {
	async findByIds(userId: string, lessonId: string) {
		return prisma.progress.findFirst({
			where: {
				userId,
				lessonId
			}
		})
	}

	async findMany(courseId: string) {
		return prisma.progress.findMany({
			where: {
				courseId
			}
		})
	}

	async create(data: Prisma.ProgressCreateManyInput) {
		return prisma.progress.create({
			data
		})
	}

	async update(id: string, data: Prisma.ProgressUpdateInput) {
		return prisma.progress.update({
			where: { id },
			data
		})
	}
}
