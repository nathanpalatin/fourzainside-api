import { FastifyReply, FastifyRequest } from 'fastify'
import jwt, { Secret, JwtPayload } from 'jsonwebtoken'

interface CustomJwtPayload extends JwtPayload {
	userId: string
}

export async function checkSessionIdExists(request: FastifyRequest, reply: FastifyReply) {
	const authHeader = request.headers['authorization']

	if (!authHeader) {
		return reply.status(404).send({
			error: 'Authorization token not found.'
		})
	}

	try {
		const verifyToken = jwt.verify(authHeader, process.env.JWT_SECRET_KEY as Secret) as CustomJwtPayload

		request.headers = { userId: verifyToken.userId }
	} catch (error) {
		return reply.status(403).send({
			error: 'Token unauthorized or expired.'
		})
	}
}
