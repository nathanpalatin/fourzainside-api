import { Prisma, type Notifications } from '@prisma/client'

export interface NotificationsRepository {
	findById(id: string): Promise<Notifications | null>

	create(data: Prisma.NotificationsCreateInput): Promise<Notifications>
	delete(id: string): Promise<Notifications | null>
}
