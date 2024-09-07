import { env } from './env'

import fastify from 'fastify'
import cookie from '@fastify/cookie'
import fastifyJwt from '@fastify/jwt'
import multipart from '@fastify/multipart'

import { postsRoutes } from './routes/posts'
import { usersRoutes } from './routes/users'
import { chatsRoutes } from './routes/chats'
import { productsRoutes } from './routes/products'
import { transactionsRoutes } from './routes/transactions'
import { notificationsRoutes } from './routes/notifications'

import { ZodError } from 'zod'

export const app = fastify()

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

app.register(cookie)

app.register(multipart)

app.register(usersRoutes, {
	prefix: 'users'
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

app.setErrorHandler((error, _, reply) => {
	if (error instanceof ZodError) {
		return reply.status(400).send({ error: 'Validation error', issues: error.format() })
	}
})
