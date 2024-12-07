import { Prisma, Lessons } from '@prisma/client'
import type { LessonWithoutUpdatedAt } from './prisma/prisma-lesson-repository'

export interface LessonsRepository {
	findById(id: string): Promise<Lessons | null>
	findBySlug(slug: string): Promise<Lessons | null>
	findMany(slug: string): Promise<LessonWithoutUpdatedAt[]>
	create(data: Prisma.LessonsUncheckedCreateInput): Promise<Lessons>
	delete(id: string): Promise<void>
}
