import { type UpdateAccountUseCaseRequest } from '../@types/use-cases/users'

import type { UsersRepository } from '../repositories/users-repository'

import { UserAlreadyExistsError } from './errors/user-already-exists-error'

export class UpdateAccountUseCase {
	constructor(private usersRepository: UsersRepository) {}

	async execute({
		userId,
		name,
		cpf,
		birthdate,
		gender,
		phone,
		address,
		city,
		uf,
		complement,
		zipCode,
		international,
		number,
		neighborhood
	}: UpdateAccountUseCaseRequest): Promise<void> {
		if (phone) {
			const userWithSamePhone = await this.usersRepository.findByPhone(phone)

			if (userWithSamePhone) {
				throw new UserAlreadyExistsError()
			}
		}

		if (cpf) {
			const userWithSameCPF = await this.usersRepository.findByCPF(cpf)

			if (userWithSameCPF) {
				throw new UserAlreadyExistsError()
			}
		}

		await this.usersRepository.update(userId, {
			name,
			cpf,
			complement,
			neighborhood,
			phone,
			zipCode,
			international,
			gender,
			birthdate,
			address,
			number,
			city,
			uf,
			updatedAt: new Date()
		})
	}
}
