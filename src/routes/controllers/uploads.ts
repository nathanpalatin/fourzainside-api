import type { FastifyInstance } from 'fastify'
import { randomUUID } from 'node:crypto'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { createSlug } from '../../utils/functions'
import { put } from '@vercel/blob'

export async function uploadRoutes(app: FastifyInstance) {
	app.withTypeProvider<ZodTypeProvider>().post('/', async (request, reply) => {
		const file = await request.file()
		if (!file) {
			return reply.status(400).send({ error: 'No file uploaded' })
		}

		const uploadId = randomUUID()
		const filePath = createSlug(file.filename ?? 'file')
		const uniqueFilename = `${uploadId}-${filePath}`
		const chunks: Buffer[] = []

		try {
			await new Promise<void>((resolve, reject) => {
				file.file.on('data', (chunk: Buffer) => chunks.push(chunk))
				file.file.on('end', resolve)
				file.file.on('error', reject)
			})

			const fileBuffer = Buffer.concat(chunks)

			const { url } = await put(uniqueFilename, fileBuffer, {
				access: 'public'
			})

			return reply.status(200).send({
				url
			})
		} catch (error) {
			return reply.status(500).send({ error: 'Upload failed' })
		}
	})
}
