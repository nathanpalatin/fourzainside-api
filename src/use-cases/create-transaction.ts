import type {
	TransactionUseCaseRequest,
	TransactionUseCaseResponse
} from '../@types/use-cases/transactions'
import type { TransactionsRepository } from '../repositories/transactions-repository'

export class TransactionUseCase {
	constructor(private transactionRepository: TransactionsRepository) {}

	async execute({
		title,
		amount,
		type,
		userId
	}: TransactionUseCaseRequest): Promise<TransactionUseCaseResponse> {
		const transaction = await this.transactionRepository.create(
			{
				title,
				amount,
				type,
				user: {
					connect: { id: userId }
				},
				createdAt: new Date(),
				updatedAt: new Date()
			},
			userId
		)

		return {
			transaction
		}
	}
}
