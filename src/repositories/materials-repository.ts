import { Prisma, Materials } from '@prisma/client'

export interface MaterialsRepository {
	findById(id: string): Promise<Materials | null>
	findMany(slug: string): Promise<Materials[]>
	create(data: Prisma.MaterialsUncheckedCreateInput): Promise<Materials>
	delete(id: string): Promise<void>
}
