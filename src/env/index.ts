import 'dotenv/config'
import { z } from 'zod'

const envSchema = z.object({
	NODE_ENV: z
		.enum(['development', 'test', 'production'])
		.default('development'),
	DATABASE_CLIENT: z.enum(['mysql', 'pg']).default('pg'),
	DATABASE_URL: z.string().url(),
	JWT_SECRET_KEY: z.string(),
	CLOUDFLARE_ENDPOINT: z.string().url(),
	CLOUDFLARE_ACCESS_KEY_ID: z.string(),
	CLOUDFLARE_SECRET_ACCESS_KEY: z.string(),
	BLOB_READ_WRITE_TOKEN: z.string(),
	PORT: z.coerce.number().default(3333)
})

const _env = envSchema.safeParse(process.env)

if (_env.success === false) {
	console.error('⚠️ Invalid environment variables', _env.error.format())

	throw new Error('Invalid environment variables.')
}

export const env = _env.data
