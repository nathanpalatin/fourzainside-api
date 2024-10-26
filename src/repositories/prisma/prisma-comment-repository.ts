import { Prisma } from '@prisma/client'

import { prisma } from '../../lib/prisma'

import type { CommentsRepository } from '../comments-repository'

export class PrismaCommentRepository implements CommentsRepository {
	async findById(id: string) {
		const lesson = await prisma.comments.findUnique({
			where: {
				id
			}
		})
		return lesson
	}
	async create(data: Prisma.CommentsCreateInput) {
		const lesson = await prisma.comments.create({
			data
		})
		return lesson
	}

	async findMany(lessonId: string) {
		const lessons = await prisma.comments.findMany({
			orderBy: {
				createdAt: 'desc'
			},
			where: {
				lessonId
			}
		})

		return lessons
	}

	async delete(id: string) {
		const lesson = await prisma.comments.delete({
			where: {
				id
			}
		})
		return lesson
	}
}
