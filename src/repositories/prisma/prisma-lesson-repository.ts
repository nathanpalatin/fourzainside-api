import { Prisma } from '@prisma/client'

import { prisma } from '../../lib/prisma'

import type { LessonsRepository } from '../lessons-repository'

export class PrismaLessonRepository implements LessonsRepository {
	async findById(id: string) {
		const lesson = await prisma.lessons.findUnique({
			where: {
				id
			}
		})
		return lesson
	}
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
