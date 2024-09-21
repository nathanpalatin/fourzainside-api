import { hash } from 'bcrypt'
import { prisma } from '../lib/prisma'
import { RegisterUseCaseRequest } from '../@types/use-cases/users'

export async function registerUseCase({ name, email, phone, password }: RegisterUseCaseRequest) {
	const userWithSameEmail = await prisma.users.findUnique({
		where: {
			email
		}
	})

	if (userWithSameEmail) {
		throw new Error('Email already exists')
	}

	const password_hash = await hash(password, 6)

	await prisma.users.create({
		data: {
			name,
			username: name.trim().toLowerCase(),
			email,
			phone,
			password: password_hash
		}
	})
}
