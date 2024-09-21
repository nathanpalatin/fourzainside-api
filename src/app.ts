import { env } from './env'

import fastify from 'fastify'
import cookie from '@fastify/cookie'
import fastifyJwt from '@fastify/jwt'
import multipart from '@fastify/multipart'
import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUI from '@fastify/swagger-ui'

import { ZodError } from 'zod'

import {
	jsonSchemaTransform,
	serializerCompiler,
	validatorCompiler,
	ZodTypeProvider
} from 'fastify-type-provider-zod'

import { postsRoutes } from './routes/posts'
import { usersRoutes } from './routes/users'
import { chatsRoutes } from './routes/chats'
import { productsRoutes } from './routes/products'
import { transactionsRoutes } from './routes/transactions'
import { notificationsRoutes } from './routes/notifications'
import { uploadRoutes } from './routes/upload-files'
import { walletRoutes } from './routes/wallets'

export const app = fastify().withTypeProvider<ZodTypeProvider>()

app.route({
	method: 'GET',
	url: '/',
	handler: async () => {
		return {
			montvenue: 'Route API Protected by God'
		}
	}
})

app.register(fastifyJwt, {
	secret: env.JWT_SECRET_KEY,
	cookie: {
		cookieName: 'refreshToken',
		signed: false
	},
	sign: {
		expiresIn: '30m'
	}
})

app.setSerializerCompiler(serializerCompiler)
app.setValidatorCompiler(validatorCompiler)

app.register(fastifySwagger, {
	openapi: {
		info: {
			title: 'API NODE Rest',
			description: 'by Nathan Palatin.',
			version: '1.0.0'
		}
	},
	transform: jsonSchemaTransform
})

app.register(fastifySwaggerUI, {
	routePrefix: '/docs'
})

app.register(cookie)

app.register(multipart)

app.register(usersRoutes, {
	prefix: 'users'
})

app.register(walletRoutes, {
	prefix: 'wallets'
})

app.register(postsRoutes, {
	prefix: 'posts'
})

app.register(notificationsRoutes, {
	prefix: 'notifications'
})

app.register(chatsRoutes, {
	prefix: 'chats'
})

app.register(productsRoutes, {
	prefix: 'products'
})

app.register(transactionsRoutes, {
	prefix: 'transactions'
})

app.register(uploadRoutes, {
	prefix: 'uploads'
})

app.setErrorHandler((error, _, reply) => {
	if (error instanceof ZodError) {
		return reply.status(400).send({ error: 'Validation error', issues: error.format() })
	}
})
