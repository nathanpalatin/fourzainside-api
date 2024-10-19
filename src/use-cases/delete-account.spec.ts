import { expect, describe, it, beforeEach } from 'vitest'
import { hash } from 'bcrypt'

import { DeleteAccountUseCase } from './delete-account'
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-user-repository'

let usersRepository: PrismaUsersRepository
let sut: DeleteAccountUseCase

describe('Delete account Use Case', () => {
	beforeEach(() => {
		usersRepository = new PrismaUsersRepository()
		sut = new DeleteAccountUseCase(usersRepository)
	})

	it('should be able to delete account', async () => {
		const user = await usersRepository.create({
			name: 'John Doe',
			email: 'johndoe@example.com',
			cpf: '999.999.999-99',
			phone: '+5547999999999',
			birthdate: '1993-06-14T00:00:00Z',
			password: await hash('123456', 1)
		})
		const deletedUser = await sut.execute({ userId: user.id })

		expect(deletedUser).toBe(null)
	})
})
