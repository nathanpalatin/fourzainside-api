import { Prisma, Users, ValidationCode } from '@prisma/client'

export interface UsersRepository {
	findById(id: string): Promise<Users | null>
	findMany(
		courseId: string,
		take: number,
		skip: number
	): Promise<Users[] | null>
	findByEmail(email: string): Promise<Users | null>
	findByCPF(cpf: string): Promise<Users | null>
	findByPhone(phone: string): Promise<Users | null>

	createCode(data: ValidationCode): Promise<void>
	findCode(code: number, email: string): Promise<ValidationCode | null>

	update(id: string, data: Prisma.UsersUncheckedUpdateInput): Promise<void>
	create(data: Prisma.UsersUncheckedCreateInput): Promise<Users>
	delete(id: string): Promise<Users | null>
}
