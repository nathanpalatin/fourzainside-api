import type { UsersRepository } from '../repositories/users-repository'
import { BadRequestError } from '../routes/_errors/bad-request-error'

interface ValidateCodeUseCaseRequest {
	code: number
	userId: string
}

interface ValidateCodeUseCaseResponse {
	code: number
}

export class ValidationCodeUseCase {
	constructor(private usersRepository: UsersRepository) {}

	async execute({
		code,
		userId
	}: ValidateCodeUseCaseRequest): Promise<ValidateCodeUseCaseResponse> {
		const codeRecord = await this.usersRepository.findCode(code, userId)

		if (!codeRecord) {
			throw new BadRequestError('Invalid code')
		}

		return { code }
	}
}
