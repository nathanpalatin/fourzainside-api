import type { Transactions } from '@prisma/client'

export interface TransactionUseCaseRequest {
	title: string
	amount: number
	type: string
	userId: string
}

export interface TransactionUseCaseResponse {
	transaction: Transactions
}
