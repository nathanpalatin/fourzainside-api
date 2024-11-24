import { Prisma, Modules } from '@prisma/client'

export interface ModulesRepository {
	findById(id: string): Promise<Modules | null>
	findMany(slug: string): Promise<Modules[]>
	findBySlug(slug: string): Promise<Modules | null>

	create(data: Prisma.ModulesUncheckedCreateInput): Promise<Modules>
	delete(id: string): Promise<void>
}
