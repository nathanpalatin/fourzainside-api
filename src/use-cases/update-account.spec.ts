import { expect, describe, it, beforeEach } from 'vitest'
import { hash } from 'bcrypt'

import { InMemoryUsersRepository } from '../repositories/in-memory/in-memory-users-repository'
import { UpdateAccountUseCase } from './update-account'

let usersRepository: InMemoryUsersRepository
let sut: UpdateAccountUseCase

describe('Update account Use Case', () => {
	beforeEach(() => {
		usersRepository = new InMemoryUsersRepository()
		sut = new UpdateAccountUseCase(usersRepository)
	})
	it('should be able to update info into account', async () => {
		const { id: userId } = await usersRepository.create({
			name: 'John Doe',
			username: 'jhondoe',
			email: 'johndoe@example.com',
			phone: '+5547999999999',
			password: await hash('123456', 1)
		})

		await sut.execute({ userId, name: 'John Senna' })

		const updatedUser = await usersRepository.findById(userId)

		expect(updatedUser?.name).toEqual('John Senna')
	})
})
