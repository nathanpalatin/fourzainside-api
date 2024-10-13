import { Prisma } from '@prisma/client'

import { UsersRepository } from '../users-repository'
import { prisma } from '../../lib/prisma'

export class PrismaUsersRepository implements UsersRepository {
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
}
