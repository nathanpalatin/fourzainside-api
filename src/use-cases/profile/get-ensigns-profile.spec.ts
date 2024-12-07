import { InMemoryUsersRepository } from '../../repositories/in-memory/in-memory-users-repository'
import { hash } from 'bcrypt'
import { expect, describe, it, beforeEach } from 'vitest'
import { GetEnsignsUserUseCase } from './get-ensigns-profile'

let usersRepository: InMemoryUsersRepository
let sut: GetEnsignsUserUseCase

describe('Get Ensigns Profile Use Case', () => {
	beforeEach(() => {
		usersRepository = new InMemoryUsersRepository()
		sut = new GetEnsignsUserUseCase(usersRepository)
	})

	it('should be able to get ensigns of profile', async () => {
		const createdUser = await usersRepository.create({
			name: 'John Doe',
			username: 'johndoe',
			phone: '+554799999999999',
			cpf: '999.999.999-99',
			birthdate: '1993-06-14',
			email: 'johndoe@example.com',
			password: await hash('123456', 1)
		})

		const { ensigns } = await sut.execute({
			userId: createdUser.id
		})

		expect(ensigns?.length).toBeGreaterThanOrEqual(0)
	})
})
