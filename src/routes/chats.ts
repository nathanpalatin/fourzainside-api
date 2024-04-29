import { FastifyInstance } from 'fastify'
import { knex } from '../database'

import { randomUUID } from 'node:crypto'
import bcrypt from 'bcrypt'
import { z } from 'zod'

import util from 'node:util'
import { pipeline } from 'node:stream'
import fs from 'node:fs'

import { checkSessionIdExists } from '../middlewares/check-session-id'

export async function chatsRoutes(app: FastifyInstance) {
  app.get(
		'/',
		{
			preHandler: [checkSessionIdExists]
		},
		async (_request, reply) => {
			const chats = await knex('chats').select('id', 'userId', 'chatWithId', 'created_at')
			return reply.status(200).send({chats})
		}
	)

  app.post('/', {
    preHandler: [checkSessionIdExists]
  }, async (request, reply) => {
    const getTokenChat = z.object({
      token: z.string().uuid()
    })

    const createChatSchemaBody = z.object({
      chatWithId: z.string().uuid()
    })

      const { token: userId } = getTokenChat.parse(request.cookies)

      const { chatWithId } = createChatSchemaBody.parse(request.body)

      const [chat] = await knex('chats').insert({
        id: randomUUID(),
        userId,
        chatWithId,
        created_at: new Date(),
        updated_at: new Date()
      }).returning('*')

      return reply.status(201).send(chat)

  })

  app.delete('/', {
    preHandler: [checkSessionIdExists]
  }, async (request, reply) => {
    const getTokenTransaction = z.object({
      token: z.string().uuid()
    })

      const { token: userId } = getTokenTransaction.parse(request.cookies)

    await knex('chats').delete('*').where({
      userId
    })

    return reply.status(204).send({message: 'Chat deleted successfully'})
  })
 
}