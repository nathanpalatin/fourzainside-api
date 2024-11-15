import { env } from './env'

import fastify from 'fastify'
import cookie from '@fastify/cookie'
import fastifyJwt from '@fastify/jwt'
import multipart from '@fastify/multipart'

import {
	jsonSchemaTransform,
	serializerCompiler,
	validatorCompiler,
	ZodTypeProvider
} from 'fastify-type-provider-zod'

import { usersRoutes } from './routes/controllers/users'
import { profileRoutes } from './routes/controllers/profile'
import { coursesRoutes } from './routes/controllers/courses'
import { lessonsRoutes } from './routes/controllers/lessons'
import { notifcationsRoutes } from './routes/controllers/notifications'

import { errorHandler } from './utils/error-handlers'
import { uploadRoutes } from './routes/controllers/uploads'

export const app = fastify().withTypeProvider<ZodTypeProvider>()

app.route({
	method: 'GET',
	url: '/',
	handler: () => {
		return {
			api: 'API Route Fourza Inside.'
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

app.setErrorHandler(errorHandler)

app.register(cookie)

app.register(multipart)

app.register(usersRoutes, {
	prefix: 'users'
})

app.register(profileRoutes, {
	prefix: 'profile'
})

app.register(notifcationsRoutes, {
	prefix: 'notifications'
})

app.register(coursesRoutes, {
	prefix: 'courses'
})

app.register(lessonsRoutes, {
	prefix: 'lessons'
})

app.register(uploadRoutes, {
	prefix: 'uploads'
})
