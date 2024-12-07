import { InMemoryUsersRepository } from '../../repositories/in-memory/in-memory-users-repository'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'
import { hash } from 'bcrypt'
import { expect, describe, it, beforeEach } from 'vitest'
import { GetUserProfileUseCase } from './get-user-profile'

let usersRepository: InMemoryUsersRepository
let sut: GetUserProfileUseCase

describe('Get User Profile Use Case', () => {
	beforeEach(() => {
		usersRepository = new InMemoryUsersRepository()
		sut = new GetUserProfileUseCase(usersRepository)
	})

	it('should be able to get user profile', async () => {
		const createdUser = await usersRepository.create({
			name: 'John Doe',
			username: 'johndoe',
			phone: '+554799999999999',
			cpf: '999.999.999-99',
			birthdate: '1993-06-14',
			email: 'johndoe@example.com',
			password: await hash('123456', 1)
		})

		const { user } = await sut.execute({
			userId: createdUser.id
		})

		expect(user.name).toEqual('John Doe')
	})

	it('should not be able to get user profile with wrong id', async () => {
		await expect(() =>
			sut.execute({
				userId: 'non-existing-id'
			})
		).rejects.toBeInstanceOf(ResourceNotFoundError)
	})
})
