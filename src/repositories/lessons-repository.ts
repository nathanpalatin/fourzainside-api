import { Prisma, type Lessons } from '@prisma/client'

export interface LessonsRepository {
	findById(id: string): Promise<Lessons | null>
	findBySlug(slug: string): Promise<Lessons | null>
	findMany(slug: string): Promise<Lessons[]>
	create(data: Prisma.LessonsUncheckedCreateInput): Promise<Lessons>
	delete(id: string): Promise<void>
}
