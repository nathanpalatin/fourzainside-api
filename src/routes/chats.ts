import { FastifyInstance } from 'fastify'
import { knex } from '../database'

import { randomUUID } from 'node:crypto'

import { z } from 'zod'

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
    const getTokenChats = z.object({
      token: z.string().uuid()
    })

      const { token: userId } = getTokenChats.parse(request.cookies)

    await knex('chats').delete('*').where({
      userId
    })

    return reply.status(204).send({message: 'Chat deleted successfully'})
  })

  /* ROTAS PARA AS MENSAGENS */

  app.post('/message', {
    preHandler: [checkSessionIdExists]
  }, async (request, reply) =>{
    const getTokenMessage = z.object({
      token: z.string().uuid()
    })

    const createMessageSchemaBody = z.object({
      receiveUserId: z.string().uuid(),
      chatsId: z.string().uuid(),
      messageText: z.string(),
      messageType: z.string(),
      userName: z.string(),
  })

    const { token: sendUserId } = getTokenMessage.parse(request.cookies)

    const { receiveUserId, userName, messageText, messageType, chatsId } = createMessageSchemaBody.parse(request.body)

   
    const [message] = await knex('messages').insert({
      id: randomUUID(),
      chatsId,
      sendUserId,
      receiveUserId,
      userName,
      messageText,
      messageType,
      created_at: new Date(),
      updated_at: new Date()
    }).returning('*')

    return reply.status(201).send(message)

  })
 
}