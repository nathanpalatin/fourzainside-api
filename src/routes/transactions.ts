import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { knex } from '../database'

export async function transactionsRoutes(app: FastifyInstance) {
  app.get('/', async () => {
    const transactions = await knex('transactions')
      .select()
    return { transactions }
  })

  app.get('/transaction/:id', async (request) => {

    const getTransactionParamsSchema = z.object({
      id: z.string().uuid()
    })

    const { id } = getTransactionParamsSchema(request.params)

    const transaction = await knex('transactions')
      .select('*')
      .where('id', id)
      .first()

    return { transaction }
  })

  app.post('/newTransaction', async (request, reply) => {

    const createTransactionBodySchema = z.object({
      title: z.string(),
      amount: z.number(),
      type: z.enum(['credit', 'debit']),
    })

    const { title, amount, type } = createTransactionBodySchema.parse(
      request.body,
    )


    await knex('transactions').insert({
      id: crypto.randomUUID(),
      title,
      amount: type === 'credit' ? amount : amount * -1,
    })

    return reply.status(201).send('Transaction created successfully!')
  })

  app.delete('/deleteTransactions', async (_request, reply) => {
    await knex('transactions').delete('*')

    return reply.status(204).send('Transactions deleted successfully')
  })

  app.delete('/deleteTransaction/:id', async (_request, reply) => {
    await knex('transactions').delete('*').where('id', '=')

    return reply.status(204).send('Transaction deleted successfully')
  })
}