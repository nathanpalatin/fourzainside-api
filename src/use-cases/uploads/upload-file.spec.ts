import { randomUUID } from 'crypto'
import { expect, describe, it, beforeEach } from 'vitest'
import { UploadFileUseCase } from './upload-file'
import { InMemoryMaterialsRepository } from '../../repositories/in-memory/in-memory-materials-repository'

let fileRepository: InMemoryMaterialsRepository
let sut: UploadFileUseCase

describe('Upload File Use Case', () => {
	beforeEach(() => {
		fileRepository = new InMemoryMaterialsRepository()
		sut = new UploadFileUseCase(fileRepository)
	})

	it('should be able to save a file', async () => {
		const lessonId = randomUUID()
		const { file } = await sut.execute({
			title: 'Test',
			description: 'Test',
			url: 'https://example.com',
			lessonId
		})

		expect(file.id).toEqual(expect.any(String))
	})
})
