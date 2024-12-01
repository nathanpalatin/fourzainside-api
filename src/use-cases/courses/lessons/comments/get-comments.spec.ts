import { expect, describe, it, beforeEach } from 'vitest'
import { randomUUID } from 'node:crypto'

import { InMemoryCommentsRepository } from '../../../../repositories/in-memory/in-memory-comments-repository'
import { InMemoryLessonsRepository } from '../../../../repositories/in-memory/in-memory-lessons-repository'
import { GetCommentsLessonUseCase } from './get-comments'

let commentRepository: InMemoryCommentsRepository
let lessonRepository: InMemoryLessonsRepository
let sut: GetCommentsLessonUseCase

describe('Get comments Use Case', () => {
	beforeEach(() => {
		commentRepository = new InMemoryCommentsRepository()
		lessonRepository = new InMemoryLessonsRepository()
		sut = new GetCommentsLessonUseCase(lessonRepository, commentRepository)
	})

	it('should be able to list all comments of the lesson', async () => {
		const lesson = await lessonRepository.create({
			title: 'Teste',
			video: 'video.mp4',
			courseId: randomUUID(),
			moduleId: randomUUID(),
			slug: 'test',
			description: 'Test'
		})

		await commentRepository.create({
			content: 'teste',
			lessonId: lesson.id,
			userId: randomUUID(),
			answer: false
		})

		await commentRepository.create({
			content: 'teste 2',
			lessonId: lesson.id,
			userId: randomUUID(),
			answer: false
		})

		const { comments } = await sut.execute({ lessonId: lesson.id })

		expect(comments).toBeTruthy()
	})
})
