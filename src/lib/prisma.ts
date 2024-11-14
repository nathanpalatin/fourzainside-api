import { PrismaClient } from '../../node_modules/.prisma/client'
import { env } from '../env'

export const prisma = new PrismaClient({
	log: env.NODE_ENV === 'development' ? ['warn', 'error'] : []
})
