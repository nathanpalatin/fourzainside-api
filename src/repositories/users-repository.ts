import { Prisma, Users } from '@prisma/client'

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

	create(data: Prisma.UsersUncheckedCreateInput): Promise<Users>
	delete(id: string): Promise<Users | null>
}
