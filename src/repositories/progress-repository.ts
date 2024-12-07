import { Prisma, Progress } from '@prisma/client'

export interface ProgressRepository {
	findByIds(userId: string, lessonId: string): Promise<Progress | null>
	findMany(courseId: string): Promise<Progress[]>
	create(data: Prisma.ProgressCreateManyInput): Promise<Progress>
	update(id: string, data: Prisma.ProgressUpdateInput): Promise<Progress | null>
}
