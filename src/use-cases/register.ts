import { hash } from 'bcrypt'
import { prisma } from '../lib/prisma'

interface RegisterUseCaseRequest {
	name: string
	username: string
	email: string
	phone: string
	password: string
}

export async function registerUseCase({ name, username, email, phone, password }: RegisterUseCaseRequest) {
	const password_hash = await hash(password, 6)

	const userWithSameEmail = await prisma.users.findUnique({
		where: {
			email
		}
	})

	if (userWithSameEmail) {
		throw new Error('Email already exists')
	}

	await prisma.users.create({
		data: {
			name,
			username,
			email,
			phone,
			password: password_hash
		}
	})
}
