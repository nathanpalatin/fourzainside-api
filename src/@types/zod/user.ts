import { z } from 'zod'

export const getTokenHeaderSchema = z.object({
	userId: z.string()
})

export const createUserSchemaBody = z.object({
	name: z.string(),
	username: z.string(),
	password: z.string().min(6),
	email: z.string().email(),
	phone: z.string()
})

export const getUserParamsSchema = z.object({
	username: z.string()
})

export const getUserCredentialSchema = z.object({
	credential: z.string()
})

export const updateUserSchemaBody = z.object({
	name: z.string(),
	username: z.string(),
	password: z.string().min(6),
	phone: z.string()
})

export const createLoginSchemaBody = z.object({
	credential: z.string(),
	password: z.string().min(6)
})
