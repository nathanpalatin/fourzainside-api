import { FastifyInstance } from 'fastify'
import { knex } from '../database'

import { randomUUID } from 'node:crypto'
import { z } from 'zod'

export async function usersRoutes(app: FastifyInstance) {

  app.post('/users', async (request, reply) => {

    const createUserSchemaBody = z.object({
      id: uuid(),
      name: z.string(),
      nickname: z.string(),
      avatar: z.string(),
      email: z.string(),
      cpf: z.string(),
    })

    const { name, nickname, avatar, email, cpf, password } = createUserSchemaBody.parse(
      request.body,
    )

    let sessionId = request.cookies.sessionId

    if (!sessionId) {
      sessionId = randomUUID()

      reply.cookie('sessionId', sessionId, {
        path: '/',
        maxAge: 60 * 60 * 24 * 7 // 7 days
      })
    }

    await knex('users').insert({
      id: randomUUID(),
      name,
      nickname,
      password,
      avatar,
      email,
      cpf
    })

    return reply.status(201).send('User created successfully!')

  })
}