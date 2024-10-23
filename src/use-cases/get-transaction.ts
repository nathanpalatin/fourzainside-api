import { type Transactions } from '@prisma/client'

import { TransactionsRepository } from '../repositories/transactions-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

interface TransactionUseCaseRequest {
	transactionId: string
}

interface TransactionsUseCaseResponse {
	transaction: Transactions
}

export class GetTransactionUseCase {
	constructor(private transactionsRepository: TransactionsRepository) {}

	async execute({
		transactionId
	}: TransactionUseCaseRequest): Promise<TransactionsUseCaseResponse> {
		const transaction =
			await this.transactionsRepository.findById(transactionId)

		if (!transaction) {
			throw new ResourceNotFoundError()
		}

		return {
			transaction
		}
	}
}
