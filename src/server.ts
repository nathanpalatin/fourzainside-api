import fastify from 'fastify'
import { env } from './env'
import cookie from '@fastify/cookie'

import { transactionsRoutes } from './routes/transactions'
import { usersRoutes } from './routes/users'

const app = fastify()

app.register(cookie)

app.register(usersRoutes, {
	prefix: 'users'
})

app.register(transactionsRoutes, {
	prefix: 'transactions'
})

app
	.listen({
		port: env.PORT
	})
	.then(() => {
		console.log('Servidor iniciado na porta:', env.PORT)
	})
