import fastify from 'fastify'
import cookie from '@fastify/cookie'

import multipart from '@fastify/multipart'

import { transactionsRoutes } from './routes/transactions'
import { productsRoutes } from './routes/products'
import { usersRoutes } from './routes/users'

export const app = fastify()

app.route({
	method: 'GET',
	url: '/',
	schema: {
		response: {
			200: {
				type: 'object',
				properties: {
					error: { type: 'string' }
				}
			}
		}
	},
	handler: (_request, reply) => {
		reply.send({ error: 'Your request is empty' })
	}
})

app.register(cookie)

app.register(multipart)

app.register(productsRoutes, {
	prefix: 'products'
})

app.register(usersRoutes, {
	prefix: 'users'
})

app.register(transactionsRoutes, {
	prefix: 'transactions'
})
