import { randomUUID } from 'node:crypto'

import { Prisma, type Transactions } from '@prisma/client'
import type { TransactionsRepository } from '../transactions-repository'

export class InMemoryTransactionsRepository implements TransactionsRepository {
	public items: Transactions[] = []

	async findById(id: string) {
		const transaction = this.items.find(item => item.id === id)

		if (!transaction) {
			return null
		}

		return transaction
	}

	async findMany(userId: string) {
		const transactions = {
			...this.items,
			userId
		}

		return transactions
	}

	async create(data: Prisma.TransactionsCreateInput, userId: string) {
		const transaction = {
			id: randomUUID(),
			amount: data.amount,
			userId,
			title: data.title,
			type: data.type,
			createdAt: new Date(),
			updatedAt: new Date()
		}

		this.items.push(transaction)

		return transaction
	}
}
