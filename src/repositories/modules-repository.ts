import { Prisma, Modules } from '@prisma/client'
export interface ModulesRepository {
	findById(id: string): Promise<Modules | null>
	findMany(courseId: string): Promise<Modules[] | null>
	findBySlug(slug: string): Promise<Modules | null>
	findManyBySlug(slug: string): Promise<Modules[] | null>
	create(data: Prisma.ModulesUncheckedCreateInput): Promise<Modules>
	delete(id: string): Promise<void>
}
