import { Prisma, ValidationCode } from '@prisma/client'

import { UsersRepository } from '../users-repository'
import { prisma } from '../../lib/prisma'

export class PrismaUsersRepository implements UsersRepository {
	async findMany(courseId: string, take: number, skip: number) {
		const students = await prisma.users.findMany({
			orderBy: {
				name: 'desc'
			},
			where: {
				courses: {
					some: {
						id: courseId
					}
				}
			},
			include: {
				courses: true
			},
			take,
			skip
		})
		return students
	}

	async findByPhone(phone: string) {
		const user = await prisma.users.findFirst({
			where: {
				phone
			}
		})
		return user
	}
	async findByCPF(cpf: string) {
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

	async findManyEnsigns(userId: string) {
		const ensigns = await prisma.ensigns.findMany({
			where: {
				userId
			}
		})

		return ensigns
	}

	async findByEmail(email: string) {
		const user = await prisma.users.findUnique({
			where: {
				email
			}
		})
		return user
	}

	async createCode(data: Prisma.ValidationCodeUncheckedCreateInput) {
		await prisma.validationCode.create({
			data: {
				...data
			}
		})
	}
	async findCode(code: number, email: string): Promise<ValidationCode | null> {
		const codeFind = await prisma.validationCode.findFirst({
			where: {
				email,
				code
			}
		})
		return codeFind
	}

	async create(data: Prisma.UsersCreateInput) {
		const user = await prisma.users.create({
			data
		})
		return user
	}

	async update(id: string, data: Prisma.UsersUncheckedUpdateInput) {
		await prisma.users.update({
			where: {
				id
			},
			data
		})
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
