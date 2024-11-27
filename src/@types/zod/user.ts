import { z } from 'zod'

export const getTokenHeaderSchema = z.object({
	userId: z.string(),
	role: z.string().optional().default('USER')
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

export const getUserCredentialPasswordSchema = z.object({
	credential: z.string(),
	password: z.string()
})
export const getUserCredentialValidadeSchema = z.object({
	code: z.number(),
	email: z.string()
})

export const getUserRequestValidadeSchema = z.object({
	name: z.string(),
	email: z.string(),
	phone: z.string(),
	type: z.enum(['PERSONAL', 'COMPANY']),
	call: z.string().optional()
})

export const getUserCredentialSchema = z.object({
	credential: z.string()
})

export const bodyUserPasswordSchema = z.object({
	password: z.string(),
	newPassword: z.string()
})

export const updateUserSchemaBody = z.object({
	name: z.string().optional(),
	phone: z.string().optional(),
	cpf: z.string().optional(),
	uf: z.string().optional(),
	city: z.string().optional(),
	birthdate: z.string().optional(),
	address: z.string().optional(),
	gender: z.string().optional(),
	zipCode: z.string().optional(),
	complement: z.string().optional(),
	international: z.boolean().optional(),
	neighborhood: z.string().optional()
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
		avatar: z.string().nullable()
	})
})

export const responseRefreshTokenSchema = z.object({
	token: z.string(),
	refreshToken: z.string()
})
