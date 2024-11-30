import { randomUUID } from 'node:crypto'
import type { Courses, Modules, Prisma } from '@prisma/client'
import type { ModulesRepository } from '../modules-repository'

export class InMemoryModulesRepository implements ModulesRepository {
	public items: Modules[] = []
	public course: Courses[] = []

	async findById(id: string) {
		const module = this.items.find(item => item.id === id)
		if (!module) return null
		return module
	}
	async findMany(courseId: string) {
		const modules = this.items.filter(item => item.courseId === courseId)
		return modules
	}

	async findManyBySlug(slug: string) {
		const course = this.course.find(item => item.slug === slug)
		if (!course) return null
		const modules = this.items.filter(item => item.slug === course.slug)
		return modules
	}

	async findBySlug(slug: string) {
		const module = this.items.find(item => item.slug === slug)
		if (!module) return null
		return module
	}

	async create(data: Prisma.ModulesUncheckedCreateInput) {
		const module = {
			id: randomUUID(),
			courseId: data.courseId,
			title: data.title,
			slug: data.slug,
			visibility: data.visibility,
			available: data.available,
			description: data.description,
			createdAt: new Date(),
			updatedAt: new Date()
		}

		this.items.push(module)
		return module
	}
	async delete(id: string) {
		this.items = this.items.filter(item => item.id !== id)
	}
}
