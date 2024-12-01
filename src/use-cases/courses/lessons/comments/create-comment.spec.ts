import { expect, describe, it, beforeEach } from 'vitest'

import { CreateCommentLessonUseCase } from './create-comment'
import { InMemoryCommentsRepository } from '../../../../repositories/in-memory/in-memory-comments-repository'
import { InMemoryLessonsRepository } from '../../../../repositories/in-memory/in-memory-lessons-repository'
import { randomUUID } from 'node:crypto'

let commentRepository: InMemoryCommentsRepository
let lessonRepository: InMemoryLessonsRepository
let sut: CreateCommentLessonUseCase

describe('Create comment Use Case', () => {
	beforeEach(() => {
		commentRepository = new InMemoryCommentsRepository()
		lessonRepository = new InMemoryLessonsRepository()
		sut = new CreateCommentLessonUseCase(lessonRepository, commentRepository)
	})

	it('should be able to create a comment on lesson', async () => {
		const lesson = await lessonRepository.create({
			title: 'Teste',
			video: 'video.mp4',
			courseId: randomUUID(),
			moduleId: randomUUID(),
			slug: 'test',
			description: 'Test'
		})

		const { comment } = await sut.execute({
			content: 'teste',
			lessonId: lesson.id,
			userId: randomUUID(),
			answer: false
		})

		expect(comment.id).toEqual(expect.any(String))
	})
})
