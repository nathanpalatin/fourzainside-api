import { Prisma } from '@prisma/client'

import { prisma } from '../../lib/prisma'

import type { LessonsRepository } from '../lessons-repository'

export type LessonWithoutUpdatedAt = {
	id: string
	title: string
	slug: string
	description: string
	video: string | null
	cover: string | null
	createdAt: Date
	transcription: string | null
	courseId: string
	moduleId: string
}

export class PrismaLessonRepository implements LessonsRepository {
	async findBySlug(slug: string) {
		const lesson = await prisma.lessons.findFirst({
			where: {
				slug
			},
			include: {
				module: {
					select: { slug: true }
				}
			}
		})
		return lesson
	}

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
	async create(data: Prisma.LessonsUncheckedCreateInput) {
		const lesson = await prisma.lessons.create({
			data
		})

		return lesson
	}

	async findMany(): Promise<LessonWithoutUpdatedAt[]> {
		const lessons = await prisma.lessons.findMany({
			orderBy: {
				createdAt: 'desc'
			},
			select: {
				id: true,
				title: true,
				slug: true,
				description: true,
				video: true,
				cover: true,
				createdAt: true,
				updatedAt: false,
				transcription: true,
				courseId: true,
				moduleId: true
			}
		})

		const courseId = lessons.length > 0 ? lessons[0].courseId : null

		if (!courseId) {
			throw new Error('Course not found for the provided slug.')
		}

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
		await prisma.lessons.delete({
			where: {
				id
			}
		})
	}
}
