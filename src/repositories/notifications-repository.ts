import { Prisma, type Notifications } from '@prisma/client'

export interface NotificationsRepository {
	findById(id: string): Promise<Notifications | null>
	findMany(userId: string): Promise<Notifications[]>
	create(data: Prisma.NotificationsUncheckedCreateInput): Promise<Notifications>
	update(id: string): Promise<Notifications>
}
