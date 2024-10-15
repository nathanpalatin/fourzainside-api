import { GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3'
import { FastifyInstance } from 'fastify'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { r2 } from '../lib/cloudflare'
import { randomUUID } from 'crypto'
import { getFileParamsSchema, uploadBodySchema } from '../@types/zod/upload'
import { prisma } from '../lib/prisma'
import { getTokenHeaderSchema } from '../@types/zod/user'
import { checkSessionIdExists } from '../middlewares/auth-token'

export async function uploadRoutes(app: FastifyInstance) {
	app.post(
		'/',
		{
			preHandler: [checkSessionIdExists]
		},
		async request => {
			const { userId } = getTokenHeaderSchema.parse(request.headers)

			const { name, contentType } = uploadBodySchema.parse(request.body)

			const fileKey = randomUUID().concat('-').concat(name)

			const signedUrl = await getSignedUrl(
				r2,
				new PutObjectCommand({
					Bucket: 'montvenue',
					Key: fileKey,
					ContentType: contentType
				}),
				{ expiresIn: 600 }
			)

			const file = await prisma.medias.create({
				data: {
					type: contentType,
					source: signedUrl,
					userId
				}
			})

			return { signedUrl, file: file.id }
		}
	)

	app.get(
		'/:id',
		{
			preHandler: [checkSessionIdExists]
		},
		async request => {
			const { name } = getFileParamsSchema.parse(request.params)

			const fileKey = randomUUID().concat('-').concat(name)

			const signedUrl = await getSignedUrl(
				r2,
				new GetObjectCommand({
					Bucket: 'montvenue',
					Key: fileKey
				}),
				{ expiresIn: 600 }
			)

			return { signedUrl, file: fileKey }
		}
	)
}
