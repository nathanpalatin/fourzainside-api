import 'dotenv/config'
import { env } from './env'

import { knex as setupKnex, Knex } from 'knex'

if (!process.env.DATABASE_URL) {
	throw new Error('Database URL not found')
}

export const config: Knex.Config = {
	client: 'pg',
	connection: {
		filename: env.DATABASE_URL
	},
	migrations: {
		extension: 'ts',
		directory: 'db/migrations'
	},
	useNullAsDefault: true
}

export const knex = setupKnex(config)
