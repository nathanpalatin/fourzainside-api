import { FastifyInstance } from 'fastify'
import { knex } from '../database'

export async function transactionsRoutes(app: FastifyInstance) {
  app.get('/transactions', async () => {
    const transaction = knex('transactions')
      .select('*')
      .where('amount', 1000)

    return transaction
  })

  app.post('/newTransaction', async (req) => {
    const { title, amount } = req.body
    const transaction = await knex('transactions').insert({
      id: crypto.randomUUID(),
      title,
      amount,
    }).returning('*')

    return transaction
  })
}