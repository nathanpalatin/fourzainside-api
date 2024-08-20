import { hash } from 'bcrypt'
import { prisma } from '../lib/prisma'

interface RegisterUseCaseRequest {
	name: string
	email: string
	password: string
	username: string
	phone: string
}

export async function registerUseCase({ name, username, email, phone, password }: RegisterUseCaseRequest) {
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
			username,
			email,
			phone,
			password: password_hash
		}
	})
}
