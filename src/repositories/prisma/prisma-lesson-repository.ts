import { Prisma } from '@prisma/client'

import { prisma } from '../../lib/prisma'

import type { LessonsRepository } from '../lessons-repository'

export class PrismaLessonRepository implements LessonsRepository {
	async update(id: string, data: Prisma.LessonsUpdateInput) {
		const lesson = await prisma.lessons.update({
			where: {
				id
			},
			data
		})

		return lesson
	}

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

		const progresses = await prisma.progress.findMany({
			where: {
				courseId
			},
			select: {
				lessonId: true,
				completed: true
			}
		})

		const result = lessons.map(lesson => {
			const progress = progresses.find(p => p.lessonId === lesson.id)
			return {
				...lesson,
				watched: progress ? progress.completed : false
			}
		})

		return result
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
