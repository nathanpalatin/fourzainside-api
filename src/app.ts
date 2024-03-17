import fastify from 'fastify'
import cookie from '@fastify/cookie'

import { transactionsRoutes } from './routes/transactions'
import { usersRoutes } from './routes/users'
import { productsRoutes } from './routes/products'

export const app = fastify()

app.register(cookie)

app.register(productsRoutes, {
	prefix: 'products'
})

app.register(usersRoutes, {
	prefix: 'users'
})

app.register(transactionsRoutes, {
	prefix: 'transactions'
})
