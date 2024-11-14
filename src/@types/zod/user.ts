import { z } from 'zod'

export const getTokenHeaderSchema = z.object({
	userId: z.string(),
	role: z.string()
})

export const getParamsUserSchema = z.object({
	userId: z.string()
})

export const getRefreshTokenSchema = z.object({
	refreshToken: z.string()
})

export const createUserSchemaBody = z.object({
	name: z.string(),
	password: z.string().min(6),
	email: z.string().email(),
	phone: z.string()
})

export const getUserParamsSchema = z.object({
	query: z.string()
})

export const getUserCredentialSchema = z.object({
	credential: z.string()
})

export const updateUserSchemaBody = z.object({
	name: z.string().optional(),
	phone: z.string().optional(),
	avatar: z.string().optional()
})

export const createLoginSchemaBody = z.object({
	credential: z.string(),
	password: z.string().min(6)
})
export const createCryptoBodySchema = z.object({
	amount: z.string()
})

export const createWalletSchema = z.object({
	balance: z.number(),
	coinType: z.string(),
	country: z.string()
})

export const userProfileSchema = z.object({
	user: z.object({
		id: z.string().uuid(),
		role: z.enum(['ADMIN', 'USER', 'MENTOR']),
		name: z.string(),
		avatar: z.string().url().nullable()
	})
})

export const responseRefreshTokenSchema = z.object({
	token: z.string(),
	refreshToken: z.string()
})
