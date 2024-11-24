import { Prisma, Modules } from '@prisma/client'

import { prisma } from '../../lib/prisma'

import type { ModulesRepository } from '../modules-repository'

export class PrismaModuleRepository implements ModulesRepository {
	async findById(id: string) {
		const course = await prisma.modules.findUnique({
			where: {
				id
			}
		})
		return course
	}
	async findMany(courseId: string) {
		const modules = await prisma.modules.findMany({
			where: {
				courseId
			}
		})
		return modules
	}
	async findBySlug(slug: string) {
		const module = await prisma.modules.findFirst({
			where: {
				slug
			}
		})
		return module
	}
	async create(data: Prisma.ModulesUncheckedCreateInput) {
		const module = await prisma.modules.create({
			data
		})
		return module
	}
	async delete(id: string) {
		await prisma.modules.delete({
			where: {
				id
			}
		})
	}
}
