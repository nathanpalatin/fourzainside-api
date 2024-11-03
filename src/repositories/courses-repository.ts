import { Prisma, type Courses } from '@prisma/client'

export interface CoursesRepository {
	findById(id: string): Promise<Courses | null>
	findMany(userId: string): Promise<Courses[] | null>
	findBySlug(slug: string): Promise<Courses | null>

	create(data: Prisma.CoursesUncheckedCreateInput): Promise<Courses>
	//update(id: string): Promise<Courses | null>
	delete(id: string): Promise<Courses | null>
}
