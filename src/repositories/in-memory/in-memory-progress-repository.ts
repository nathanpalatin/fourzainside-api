import { Prisma, Progress } from '@prisma/client'
import type { ProgressRepository } from '../progress-repository'

export class InMemoryProgressRepository implements ProgressRepository {
	public items: Progress[] = []

	async findByIds(userId: string, lessonId: string): Promise<Progress | null> {
		throw new Error('Method not implemented.')
	}
	findMany(courseId: string): Promise<Progress[]> {
		throw new Error('Method not implemented.')
	}
	create(data: Prisma.ProgressCreateManyInput): Promise<Progress> {
		throw new Error('Method not implemented.')
	}
	update(
		id: string,
		data: Prisma.ProgressUpdateInput
	): Promise<Progress | null> {
		throw new Error('Method not implemented.')
	}
}
