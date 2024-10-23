import { expect, describe, it, beforeEach } from 'vitest'
import { randomUUID } from 'crypto'
import { InMemoryTransactionsRepository } from '../repositories/in-memory/in-memory-transactions-repository'
import { GetTransactionUseCase } from './get-transaction'

let transactionsRepository: InMemoryTransactionsRepository
let sut: GetTransactionUseCase

describe('Get One Notification Use Case', () => {
	beforeEach(() => {
		transactionsRepository = new InMemoryTransactionsRepository()
		sut = new GetTransactionUseCase(transactionsRepository)
	})

	it('should be able to get one transaction', async () => {
		const transactionCreate = await transactionsRepository.create(
			{
				title: 'TEST',
				amount: 100,
				type: 'CREDIT',
				user: {}
			},
			randomUUID()
		)
		const { transaction } = await sut.execute({
			transactionId: transactionCreate.id
		})

		expect(transaction).toBeTruthy()
	})
})
