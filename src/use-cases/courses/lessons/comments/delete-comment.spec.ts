import { expect, describe, it, beforeEach } from 'vitest'
import { randomUUID } from 'node:crypto'

import { InMemoryCommentsRepository } from '../../../../repositories/in-memory/in-memory-comments-repository'
import { InMemoryLessonsRepository } from '../../../../repositories/in-memory/in-memory-lessons-repository'
import { DeleteCommentLessonUseCase } from './delete-comment'

let lessonRepository: InMemoryLessonsRepository
let commentRepository: InMemoryCommentsRepository
let sut: DeleteCommentLessonUseCase

describe('Delete comment Use Case', () => {
	beforeEach(() => {
		commentRepository = new InMemoryCommentsRepository()
		lessonRepository = new InMemoryLessonsRepository()
		sut = new DeleteCommentLessonUseCase(commentRepository)
	})

	it('should be able to delete a comment', async () => {
		const lesson = await lessonRepository.create({
			title: 'Teste',
			video: 'video.mp4',
			courseId: randomUUID(),
			moduleId: randomUUID(),
			slug: 'test',
			description: 'Test'
		})

		const commentCreated = await commentRepository.create({
			content: 'teste',
			lessonId: lesson.id,
			userId: randomUUID(),
			answer: false
		})

		await sut.execute({ commentId: commentCreated.id })

		const deletedComment = await commentRepository.findById(commentCreated.id)

		expect(deletedComment).toBeNull()
	})
})
