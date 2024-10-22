import { Prisma } from '@prisma/client'

import { prisma } from '../../lib/prisma'
import type { TransactionsRepository } from '../transactions-repository'

export class PrismaTransactionRepository implements TransactionsRepository {
	async findById(id: string) {
		const notification = await prisma.transactions.findUnique({
			where: {
				id
			}
		})
		return notification
	}

	async create(data: Prisma.TransactionsCreateInput) {
		const notification = await prisma.transactions.create({
			data
		})
		return notification
	}
}
