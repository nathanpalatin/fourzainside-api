import { Prisma, type Comments } from '@prisma/client'

export interface CommentsRepository {
	findById(id: string): Promise<Comments | null>
	findMany(lessonId: string): Promise<Comments[]>

	create(data: Prisma.CommentsCreateInput): Promise<Comments>
	//update(id: string): Promise<Comments | null>
	delete(id: string): Promise<Comments | null>
}
