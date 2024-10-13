import { hash } from 'bcrypt'
import { prisma } from '../lib/prisma'
import { RegisterUseCaseRequest } from '../@types/use-cases/users'
import { BadRequestError } from '../routes/_errors/bad-request-error'

export async function registerUseCase({
	name,
	cpf,
	email,
	username,
	birthdate,
	phone,
	password
}: RegisterUseCaseRequest) {
	const userExists = await prisma.users.findMany({
		where: {
			OR: [{ email }, { username }, { cpf }, { phone }]
		}
	})

	if (userExists) {
		throw new BadRequestError('User already exists.')
	}

	const password_hash = await hash(password, 6)

	await prisma.users.create({
		data: {
			name,
			cpf,
			birthdate,
			username,
			email,
			phone,
			password: password_hash
		}
	})
}
