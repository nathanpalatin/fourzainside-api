import { knex as setupKnex } from 'knex'

import { configDotenv } from 'dotenv'

configDotenv()

export const config = {
  client: 'pg',
  connection: {
    host: process.env.HOST,
    port: process.env.PORT,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DB_NAME
  }
}

export const knex = setupKnex(config)