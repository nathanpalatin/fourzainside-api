import { z } from 'zod'

export interface UploadParams {
	fileName: string
	fileType: string
	body: Buffer
}

export const uploadParams = z.object({
	fileName: z.string(),
	fileType: z.string(),
	body: z.instanceof(Buffer)
})
