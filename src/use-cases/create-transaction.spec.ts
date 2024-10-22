import { expect, describe, it, beforeEach } from 'vitest'

import { randomUUID } from 'crypto'
import { InMemoryTransactionsRepository } from '../repositories/in-memory/in-memory-transactions-repository'
import { TransactionUseCase } from './create-transaction'

let transactionRepository: InMemoryTransactionsRepository
let sut: TransactionUseCase

describe('Transaction Use Case', () => {
	beforeEach(() => {
		transactionRepository = new InMemoryTransactionsRepository()
		sut = new TransactionUseCase(transactionRepository)
	})

	it('should be able to create a transaction', async () => {
		const { transaction } = await sut.execute({
			title: 'TEST',
			amount: 100,
			type: 'CREDIT',
			userId: randomUUID()
		})

		expect(transaction).toBeTruthy()
		expect(transaction?.title).toEqual('TEST')
	})
})
