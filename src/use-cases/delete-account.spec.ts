import { expect, describe, it, beforeEach } from 'vitest'
import { hash } from 'bcrypt'

import { DeleteAccountUseCase } from './delete-account'
import { InMemoryUsersRepository } from '../repositories/in-memory/in-memory-users-repository'

let usersRepository: InMemoryUsersRepository
let sut: DeleteAccountUseCase

describe('Delete account Use Case', () => {
	beforeEach(() => {
		usersRepository = new InMemoryUsersRepository()
		sut = new DeleteAccountUseCase(usersRepository)
	})
	it('should be able to delete account', async () => {
		const { id: userId } = await usersRepository.create({
			name: 'John Doe',
			username: 'jhondoe',
			email: 'johndoe@example.com',
			phone: '+5547999999999',
			password: await hash('123456', 1)
		})

		await sut.execute({ userId })

		const deletedUser = await usersRepository.findById(userId)

		expect(deletedUser).toBe(null)
	})
})
