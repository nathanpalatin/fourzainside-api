import { Prisma, Users } from '@prisma/client'

export interface UsersRepository {
	findById(id: string): Promise<Users | null>

	findByEmail(email: string): Promise<Users | null>
	findByCPF(cpf: string): Promise<Users | null>
	findByPhone(phone: string): Promise<Users | null>

	create(data: Prisma.UsersCreateInput): Promise<Users>
}
