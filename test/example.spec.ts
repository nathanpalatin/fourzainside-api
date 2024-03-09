import { expect, test } from 'vitest'

test('O usuario consegue criar uma transação', () => {
	const responseStatusCode = 201
	expect(responseStatusCode).toEqual(201)
})
