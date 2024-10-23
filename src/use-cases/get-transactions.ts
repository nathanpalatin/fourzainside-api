import { type Transactions } from '@prisma/client'

import { TransactionsRepository } from '../repositories/transactions-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

interface TransactionUseCaseRequest {
	userId: string
}

interface TransactionsUseCaseResponse {
	transactions: Transactions[]
}

export class GetTransactionsUseCase {
	constructor(private transactionsRepository: TransactionsRepository) {}

	async execute({
		userId
	}: TransactionUseCaseRequest): Promise<TransactionsUseCaseResponse> {
		const transactions = await this.transactionsRepository.findMany(userId)

		if (!transactions) {
			throw new ResourceNotFoundError()
		}

		return {
			transactions
		}
	}
}
