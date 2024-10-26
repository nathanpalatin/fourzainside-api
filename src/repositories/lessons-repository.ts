import { Prisma, type Lessons } from '@prisma/client'

export interface LessonsRepository {
	findById(id: string): Promise<Lessons | null>
	findMany(courseId: string): Promise<Lessons[]>

	create(data: Prisma.LessonsCreateInput): Promise<Lessons>
	//update(id: string): Promise<Lessons | null>
	delete(id: string): Promise<Lessons | null>
}
