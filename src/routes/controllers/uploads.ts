import { PutObjectCommand } from '@aws-sdk/client-s3'
import type { FastifyInstance } from 'fastify'
import { randomUUID } from 'node:crypto'
import { env } from '../../env'
import { r2 } from '../../lib/cloudflare'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { console } from 'node:inspector'
import { createSlug } from '../../utils/functions'

export async function uploadRoutes(app: FastifyInstance) {
	app.withTypeProvider<ZodTypeProvider>().post('/', async (request, reply) => {
		const file = await request.file()
		const uploadId = randomUUID()
		const filePath = createSlug(file?.filename ?? 'file')
		const uniqueFilename = `${uploadId}-${filePath}`
		const chunks: Buffer[] = []

		return new Promise<void>((resolve, reject) => {
			file?.file.on('data', (chunk: Buffer) => {
				chunks.push(chunk)
			})

			file?.file.on('end', async () => {
				const fileBuffer = Buffer.concat(chunks)

				try {
					await r2.send(
						new PutObjectCommand({
							Bucket: env.CLOUDFLARE_BUCKET_NAME,
							Key: uniqueFilename,
							ContentType: file?.mimetype,
							Body: fileBuffer
						})
					)

					reply.status(200).send({ url: uniqueFilename })
					resolve()
				} catch (error) {
					reply.status(500).send({ error: 'Upload failed' })
					reject(error)
				}
			})

			file?.file.on('error', err => {
				console.error('Error reading file:', err)
				reply.status(500).send({ error: 'Failed to read file' })
				reject(err)
			})
		})
	})
}
