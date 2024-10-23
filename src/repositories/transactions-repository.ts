import { Prisma, type Transactions } from '@prisma/client'

export interface TransactionsRepository {
	findById(id: string): Promise<Transactions | null>
	findMany(id: string): Promise<Transactions[] | null>

	create(
		data: Prisma.TransactionsCreateInput,
		userId: string
	): Promise<Transactions>
}
