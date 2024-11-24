import { compare } from 'bcrypt'
import { expect, describe, it, beforeEach } from 'vitest'

import { UserAlreadyExistsError } from './errors/user-already-exists-error'

import { InMemoryUsersRepository } from '../repositories/in-memory/in-memory-users-repository'
import { RegisterUseCase } from './register'

let usersRepository: InMemoryUsersRepository
let sut: RegisterUseCase

describe('Register Use Case', () => {
	beforeEach(() => {
		usersRepository = new InMemoryUsersRepository()
		sut = new RegisterUseCase(usersRepository)
	})

	it('should to register', async () => {
		const { user } = await sut.execute({
			name: 'John Doe',
			username: 'johndoe',
			phone: '+5547999999999',
			email: 'johndoe@example.com',
			password: '123456'
		})

		expect(user.id).toEqual(expect.any(String))
	})

	it('should hash user password upon registration', async () => {
		const { user } = await sut.execute({
			name: 'John Doe',
			phone: '+5547999999999',
			username: 'johndoe',
			email: 'johndoe@example.com',
			password: '123456'
		})

		const isPasswordCorrectlyHashed = await compare('123456', user.password)

		expect(isPasswordCorrectlyHashed).toBe(true)
	})

	it('should not be able to register with same email twice', async () => {
		const email = 'johndoe@example.com'

		await sut.execute({
			name: 'John Doe',
			username: 'johndoe',
			phone: '+5547999999999',
			email,
			password: '123456'
		})

		await expect(() =>
			sut.execute({
				name: 'John Doe',
				username: 'johndoe',
				phone: '+5547999999999',
				email,
				password: '123456'
			})
		).rejects.toBeInstanceOf(UserAlreadyExistsError)
	})
})
