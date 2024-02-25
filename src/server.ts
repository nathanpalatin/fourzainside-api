import fastify from 'fastify'
import crypto from 'node:crypto'
import { knex } from './database'

const app = fastify()

app.get('/db', async () => {
  const transaction = knex('transactions').insert({
    id: crypto.randomUUID(),
    title: 'Transaction test',
    amount: 1000,
  })

  return transaction
})

app
  .listen({
    port: 3333,
  })
  .then(() => {
    console.log('Servidor iniciado')
  })