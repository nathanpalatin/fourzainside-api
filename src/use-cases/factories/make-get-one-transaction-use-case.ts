import { PrismaTransactionRepository } from '../../repositories/prisma/prisma-transaction-repository'
import { GetTransactionUseCase } from '../get-transaction'

export function makeGetTransactionUseCase() {
	const transactionRepository = new PrismaTransactionRepository()
	const useCase = new GetTransactionUseCase(transactionRepository)

	return useCase
}
