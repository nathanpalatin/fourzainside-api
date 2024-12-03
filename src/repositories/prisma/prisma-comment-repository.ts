import { Prisma, type Comments } from '@prisma/client'

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
	async create(data: Prisma.CommentsUncheckedCreateInput) {
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

	async update(id: string, content: string) {
		const comment = await prisma.comments.update({
			where: {
				id
			},
			data: {
				content
			}
		})
		return comment
	}

	async delete(id: string) {
		await prisma.comments.delete({
			where: {
				id
			}
		})
	}
}
