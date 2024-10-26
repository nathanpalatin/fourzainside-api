import { Prisma } from '@prisma/client'

import { prisma } from '../../lib/prisma'

import type { CommentsRepository } from '../comments-repository'

export class PrismaCommentRepository implements CommentsRepository {
	async findById(id: string) {
		const comment = await prisma.comments.findUnique({
			where: {
				id
			}
		})
		return comment
	}
	async create(data: Prisma.CommentsCreateInput) {
		const comment = await prisma.comments.create({
			data
		})
		return comment
	}

	async findMany(lessonId: string) {
		const comments = await prisma.comments.findMany({
			orderBy: {
				createdAt: 'desc'
			},
			where: {
				lessonId
			}
		})

		return comments
	}

	async delete(id: string) {
		const comment = await prisma.comments.delete({
			where: {
				id
			}
		})
		return comment
	}
}
