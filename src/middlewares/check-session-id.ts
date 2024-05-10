import { FastifyReply, FastifyRequest } from 'fastify'
import jwt, { Secret } from 'jsonwebtoken'

export async function checkSessionIdExists(request: FastifyRequest, reply: FastifyReply) {
	const authHeader = request.headers['authorization']

	try {
		if (!authHeader) {
			return reply.status(401).send({
				error: 'Authorization is empty'
			})
		}

		const verifyToken = jwt.verify(authHeader, process.env.JWT_SECRET_KEY as Secret)

		if (!verifyToken) {
			return reply.status(401).send({
				error: 'Token unauthorized'
			})
		}
	} catch (err) {
		if (err instanceof jwt.JsonWebTokenError) {
			return reply.status(401).send({
				error: 'Token unauthorized'
			})
		}
	}
}
