import { Prisma, type Users } from '@prisma/client'

import { UsersRepository } from '../users-repository'
import { prisma } from '../../lib/prisma'

export class PrismaUsersRepository implements UsersRepository {
	async findByPhone(phone: string): Promise<Users | null> {
		const user = await prisma.users.findFirst({
			where: {
				phone
			}
		})
		return user
	}
	async findByCPF(cpf: string): Promise<Users | null> {
		const user = await prisma.users.findFirst({
			where: {
				cpf
			}
		})
		return user
	}
	async findById(id: string) {
		const user = await prisma.users.findUnique({
			where: {
				id
			}
		})
		return user
	}

	async findByEmail(email: string) {
		const user = await prisma.users.findUnique({
			where: {
				email
			}
		})
		return user
	}

	async create(data: Prisma.UsersCreateInput) {
		const user = await prisma.users.create({
			data
		})
		return user
	}

	async delete(id: string) {
		const user = await prisma.users.delete({
			where: {
				id
			}
		})
		return user
	}
}
