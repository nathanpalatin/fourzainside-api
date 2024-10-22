import { PrismaTransactionRepository } from '../../repositories/prisma/prisma-transaction-repository'
import { TransactionUseCase } from '../create-transaction'

export function makeTransactionUseCase() {
	const transactionRepository = new PrismaTransactionRepository()
	const useCase = new TransactionUseCase(transactionRepository)

	return useCase
}
