import { knex as setupKnex, Knex } from 'knex'

import { configDotenv } from 'dotenv'

configDotenv()

export const config: Knex.Config = {
  client: 'sqlite3',
  connection: {
    /*  host: process.env.HOST,
     port: process.env.PORT,
     user: process.env.USER,
     password: process.env.PASSWORD,
     database: process.env.DB_NAME, */
    filename: './db/app.db'
  },
  migrations: {
    extension: 'ts',
    directory: 'db/migrations'
  },
  useNullAsDefault: true
}

export const knex = setupKnex(config)