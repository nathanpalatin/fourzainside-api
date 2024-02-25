import 'dotenv/config'
import { env } from './env'

import { knex as setupKnex, Knex } from 'knex'

if (!process.env.DATABASE_URL) {
  throw new Error('Database URL not found')
}

export const config: Knex.Config = {
  client: 'sqlite',
  connection: {
    host: env.HOST,
    port: env.PORT,
    user: env.USER,
    password: env.PASSWORD,
    database: env.DB_NAME,
    filename: env.DATABASE_URL
  },
  migrations: {
    extension: 'ts',
    directory: 'db/migrations'
  },
  useNullAsDefault: true
}

export const knex = setupKnex(config)