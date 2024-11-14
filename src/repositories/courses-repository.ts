import { Prisma, Courses } from '@prisma/client'

export interface CoursesRepository {
	findById(id: string): Promise<Courses | null>
	findMany(userId: string, role: string): Promise<Courses[] | null>
	findBySlug(slug: string): Promise<Courses | null>

	create(data: Prisma.CoursesUncheckedCreateInput): Promise<Courses>
	delete(id: string): Promise<Courses | null>
}
