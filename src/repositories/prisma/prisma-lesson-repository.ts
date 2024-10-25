import { Prisma, type Lessons } from '@prisma/client'

import { prisma } from '../../lib/prisma'
import type { LessonsRepository } from '../lessons-repository'

export class PrismaLessonRepository implements LessonsRepository {
	async create(data: Prisma.LessonsCreateInput) {
		const lesson = await prisma.lessons.create({
			data
		})
		return lesson
	}

	async findMany(courseId: string) {
		const lessons = await prisma.lessons.findMany({
			orderBy: {
				createdAt: 'desc'
			},
			where: {
				courseId
			}
		})

		return lessons
	}

	async delete(id: string) {
		const lesson = await prisma.lessons.delete({
			where: {
				id
			}
		})
		return lesson
	}
}
