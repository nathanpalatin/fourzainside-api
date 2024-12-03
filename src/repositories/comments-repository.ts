import { Prisma, type Comments } from '@prisma/client'

export interface CommentsRepository {
	findById(id: string): Promise<Comments | null>
	findMany(lessonId: string): Promise<Comments[]>
	create(data: Prisma.CommentsUncheckedCreateInput): Promise<Comments>
	update(id: string, content: string): Promise<Comments>
	delete(id: string): Promise<void>
}
