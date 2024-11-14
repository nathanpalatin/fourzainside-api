import { expect, describe, it, beforeEach } from 'vitest'

import { randomUUID } from 'crypto'
import { InMemoryUsersRepository } from '../repositories/in-memory/in-memory-users-repository'
import { ValidationCodeUseCase } from './validation-code'

let userRepository: InMemoryUsersRepository
let sut: ValidationCodeUseCase

describe('Validation Code Use Case', () => {
	beforeEach(() => {
		userRepository = new InMemoryUsersRepository()
		sut = new ValidationCodeUseCase(userRepository)
	})

	it('should be able to validate email code', async () => {
		const userId = randomUUID()
		await userRepository.createCode({
			id: randomUUID(),
			code: 1111,
			userId,
			expiresAt: new Date()
		})

		const codeValidate = await sut.execute({
			userId,
			code: 1111
		})

		expect(codeValidate).toBe(undefined)
	})
})
