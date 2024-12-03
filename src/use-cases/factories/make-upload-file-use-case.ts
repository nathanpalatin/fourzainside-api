import { PrismaMaterialsRepository } from '../../repositories/prisma/prisma-material-repository'
import { UploadFileUseCase } from '../uploads/upload-file'

export function makeUploadFileUseCase() {
	const usersRepository = new PrismaMaterialsRepository()
	const useCase = new UploadFileUseCase(usersRepository)
	return useCase
}
