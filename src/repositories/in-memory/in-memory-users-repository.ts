import { randomUUID } from 'node:crypto'

import { Users, Prisma, type ValidationCode } from '@prisma/client'
import type { UsersRepository } from '../users-repository'

export class InMemoryUsersRepository implements UsersRepository {
	public items: Users[] = []
	public code: ValidationCode[] = []

	async findByPhone(phone: string) {
		const user = this.items.find(item => item.phone === phone)

		if (!user) {
			return null
		}

		return user
	}

	async findMany(
		courseId: string,
		take: number,
		skip: number
	): Promise<Users[]> {
		const students = this.items.filter(course => course.id === courseId)
		return students.slice(skip, skip + take)
	}

	async findByCPF(cpf: string) {
		const user = this.items.find(item => item.cpf === cpf)

		if (!user) {
			return null
		}

		return user
	}

	async createCode(data: ValidationCode) {
		const code = {
			id: randomUUID(),
			code: data.code,
			userId: data.userId,
			expiresAt: new Date()
		}
		this.code.push(code)
	}

	async findCode(code: number, userId: string) {
		const result = this.code.find(
			item => item.id === userId && item.code === code
		)

		if (!result) {
			return null
		}

		return result
	}
	async findById(id: string) {
		const user = this.items.find(item => item.id === id)

		if (!user) {
			return null
		}

		return user
	}

	async findByEmail(email: string) {
		const user = this.items.find(item => item.email === email)

		if (!user) {
			return null
		}

		return user
	}

	async create(data: Prisma.UsersUncheckedCreateInput) {
		const user = {
			id: randomUUID(),
			name: data.name,
			address: data.address ?? null,
			gender: data.gender ?? 'male',
			city: data.city ?? null,
			state: data.state ?? null,
			zipCode: data.zipCode ?? null,
			occupation: data.occupation ?? null,
			username: data.username,
			birthdate: data.birthdate ?? '',
			cpf: data.cpf ?? '',
			avatar: null,
			role: data.role ?? 'USER',
			emailVerified: false,
			email: data.email,
			phone: data.phone,
			password: data.password,
			createdAt: new Date(),
			updatedAt: new Date()
		}

		this.items.push(user)

		return user
	}

	async update(
		id: string,
		data: Partial<Prisma.UsersUncheckedUpdateManyInput>
	) {
		const userIndex = this.items.findIndex(item => item.id === id)
		if (userIndex === -1) {
			return null
		}
		//@ts-ignore
		this.items[userIndex] = {
			...this.items[userIndex],
			...data
		}

		return this.items[userIndex]
	}

	async delete(id: string) {
		const user = this.items.find(item => item.id === id)
		if (!user) {
			return null
		}

		this.items = this.items.filter(item => item.id !== id)

		return user
	}
}
