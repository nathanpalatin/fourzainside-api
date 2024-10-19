import { expect, describe, it, beforeEach } from 'vitest'

import { InMemoryUsersRepository } from '../repositories/in-memory/in-memory-users-repository'

import { deleteAccountUseCase } from './delete-account'
import { RegisterUseCase } from './register'

let usersRepository: InMemoryUsersRepository
let sut: RegisterUseCase
let del: deleteAccountUseCase

describe('Delete account Use Case', () => {
	beforeEach(() => {
		usersRepository = new InMemoryUsersRepository()
		sut = new RegisterUseCase(usersRepository)
		del = new deleteAccountUseCase(usersRepository)
	})
	it('should be able to delete account', async () => {
		const { user } = await sut.execute({
			name: 'John Doe',
			cpf: '999.999.999-99',
			phone: '+5547999999999',
			birthdate: '1993-06-14T00:00:00Z',
			email: 'johndoe@example.com',
			password: '123456'
		})

		await del.execute({ userId: user.id })

		const deletedUser = await usersRepository.findById(user.id)

		expect(deletedUser).toBeNull()
	})
})
