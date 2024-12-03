import type { Materials } from '@prisma/client'
import type { MaterialsRepository } from '../../repositories/materials-repository'

interface UploadUseCaseRequest {
	title: string
	description: string
	url: string
	lessonId: string
}

interface UploadUseCaseResponse {
	file: Materials
}

export class UploadFileUseCase {
	constructor(private fileRepository: MaterialsRepository) {}

	async execute({
		title,
		description,
		url,
		lessonId
	}: UploadUseCaseRequest): Promise<UploadUseCaseResponse> {
		const file = await this.fileRepository.create({
			title,
			description,
			url,
			lessonId,
			createdAt: new Date()
		})

		return { file }
	}
}
