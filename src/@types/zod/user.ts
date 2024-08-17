import { z } from 'zod'

export const getUserHeaderSchema = z.object({
	userId: z.string()
})

export const createUserSchemaBody = z.object({
	name: z.string(),
	username: z.string(),
	password: z.string(),
	email: z.string(),
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
	password: z.string(),
	phone: z.string()
})

export const createLoginSchemaBody = z.object({
	credential: z.string(),
	password: z.string()
})
