import { expect, describe, it, beforeEach } from 'vitest'
import { randomUUID } from 'crypto'
import { InMemoryTransactionsRepository } from '../repositories/in-memory/in-memory-transactions-repository'
import { GetTransactionsUseCase } from './get-transactions'

let transactionsRepository: InMemoryTransactionsRepository
let sut: GetTransactionsUseCase

describe('Get Notifications Use Case', () => {
	beforeEach(() => {
		transactionsRepository = new InMemoryTransactionsRepository()
		sut = new GetTransactionsUseCase(transactionsRepository)
	})

	it('should be able to get all user transactions', async () => {
		const { transactions } = await sut.execute({
			userId: randomUUID()
		})

		expect(transactions).toBeTruthy()
	})
})
