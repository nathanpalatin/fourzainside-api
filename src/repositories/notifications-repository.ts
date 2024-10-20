import { Prisma, type Notifications } from '@prisma/client'

export interface NotificationsRepository {
	findById(id: string): Promise<Notifications | null>

	create(data: Prisma.NotificationsCreateInput): Promise<Notifications>
	update(id: string): Promise<Notifications | null>
	delete(id: string): Promise<Notifications | null>
}
